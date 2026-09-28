import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { MockExamDto } from '@/src/core/application/common/dtos';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeListMockExamsByAuthor } from '@/src/core/main/factories/mock-exam/make-list-mock-exams-by-author.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const TEST_STUDENT_USERNAME = 'student.examstats.teste';
const TEST_STUDENT2_USERNAME = 'student2.examstats.teste';
const TEST_TEACHER_USERNAME = 'teacher.examstats.teste';
const TEST_TEACHER2_USERNAME = 'teacher2.examstats.teste';
const TEST_ADMIN_USERNAME = 'admin.examstats.teste';

const ALL_TEST_USERNAMES = [
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
  TEST_TEACHER_USERNAME,
  TEST_TEACHER2_USERNAME,
  TEST_ADMIN_USERNAME,
];

const MEDIUM_PROFILE = {
  correctCount: 30,
  certaintyCount: 20,
  doubtErrors: 3,
  distractionErrors: 5,
  interpretationErrors: 4,
};

const PERFECT_PROFILE = {
  correctCount: 45,
  certaintyCount: 45,
  doubtErrors: 0,
  distractionErrors: 0,
  interpretationErrors: 0,
};

type AreaMetrics = {
  correctCount: number;
  certaintyCount: number;
  doubtErrors: number;
  distractionErrors: number;
  interpretationErrors: number;
};

const PRISMA_AREAS = [
  'LANGUAGES',
  'HUMANITIES',
  'NATURAL_SCIENCES',
  'MATHEMATICS',
] as const;

function makeSut() {
  return makeListMockExamsByAuthor();
}

async function createUser(data: {
  name: string;
  username: string;
  role: Role;
}): Promise<string> {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      passwordHash: 'not-used-in-these-tests',
      role: data.role,
    },
  });

  return user.id;
}

async function linkStudentToTeacher(
  studentId: string,
  teacherId: string,
): Promise<void> {
  await prisma.studentTeacher.create({
    data: { studentId, teacherId },
  });
}

async function createMockExam(params: {
  authorId: string;
  title: string;
  profile: AreaMetrics;
  createdAt?: Date;
}): Promise<string> {
  const mockExam = await prisma.mockExam.create({
    data: {
      authorId: params.authorId,
      title: params.title,
      createdAt: params.createdAt,
      performances: {
        create: PRISMA_AREAS.map((area) => ({
          area,
          ...params.profile,
        })),
      },
    },
  });

  return mockExam.id;
}

function makeRequest(params: {
  username?: string;
  requester: { id: string; username: string; role: Role };
}): AuthenticatedRequest<void, { username: string }> {
  return {
    body: undefined as unknown as void,
    params:
      params.username !== undefined ? { username: params.username } : undefined,
    requester: params.requester,
  };
}

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  await prisma.studentTeacher.deleteMany({
    where: {
      OR: [
        { student: { username: { in: ALL_TEST_USERNAMES } } },
        { teacher: { username: { in: ALL_TEST_USERNAMES } } },
      ],
    },
  });

  await prisma.user.deleteMany({
    where: { username: { in: ALL_TEST_USERNAMES } },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('ListUserMockExamsStatisticsController (integration)', () => {
  describe('GET /api/mock-exams/users/:username — success cases', () => {
    it('should return 200 with empty mockExams array when the user has no mock exams', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          username: 'me',
          requester: {
            id: studentId,
            username: TEST_STUDENT_USERNAME,
            role: ROLES.STUDENT,
          },
        }),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as MockExamDto[];
      expect(body).toEqual([]);
    });

    it('should return the correctly mapped mockExams for a single mock exam', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createMockExam({
        authorId: studentId,
        title: 'Simulado 1',
        profile: MEDIUM_PROFILE,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          username: 'me',
          requester: {
            id: studentId,
            username: TEST_STUDENT_USERNAME,
            role: ROLES.STUDENT,
          },
        }),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as MockExamDto[];
      expect(body).toHaveLength(1);

      const [exam] = body;
      expect(exam.authorId).toBe(studentId);
      expect(exam.title).toBe('Simulado 1');
      expect(typeof exam.createdAt).toBe('string');

      const languagesStats = exam.performances.languages.statistics;
      expect(languagesStats.overallResult).toEqual({
        totalQuestions: 45,
        correctAnswers: 30,
        wrongAnswers: 15,
        performanceRate: 30 / 45,
      });
      expect(languagesStats.qualityAssessment).toEqual({
        certaintyHits: 20,
        confidenceRate: 20 / 30,
        doubtHits: 10,
        doubtErrors: 3,
        criticalErrors: 12,
      });
      expect(languagesStats.errorAnalysis).toEqual({
        distractionErrors: 5,
        interpretationErrors: 4,
        knowledgeGapsErrors: 6,
      });
    });

    it('should order mockExams by createdAt in descending order', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const olderDate = new Date('2024-01-01T10:00:00.000Z');
      const newerDate = new Date('2024-06-01T10:00:00.000Z');

      await createMockExam({
        authorId: studentId,
        title: 'Simulado Antigo',
        profile: MEDIUM_PROFILE,
        createdAt: olderDate,
      });
      await createMockExam({
        authorId: studentId,
        title: 'Simulado Recente',
        profile: MEDIUM_PROFILE,
        createdAt: newerDate,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          username: 'me',
          requester: {
            id: studentId,
            username: TEST_STUDENT_USERNAME,
            role: ROLES.STUDENT,
          },
        }),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as MockExamDto[];
      expect(body).toHaveLength(2);
      expect(body.map((e) => e.title)).toEqual([
        'Simulado Recente',
        'Simulado Antigo',
      ]);
    });

    it('should allow an ADMIN to view any STUDENT mock exams by username', async () => {
      const adminId = await createUser({
        name: 'Admin Teste',
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createMockExam({
        authorId: studentId,
        title: 'Simulado do Aluno',
        profile: PERFECT_PROFILE,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          username: TEST_STUDENT_USERNAME,
          requester: {
            id: adminId,
            username: TEST_ADMIN_USERNAME,
            role: ROLES.ADMIN,
          },
        }),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as MockExamDto[];
      expect(body).toHaveLength(1);
      expect(body[0].authorId).toBe(studentId);
    });

    it('should allow a TEACHER to view mock exams of a STUDENT explicitly assigned to them', async () => {
      const teacherId = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await linkStudentToTeacher(studentId, teacherId);
      await createMockExam({
        authorId: studentId,
        title: 'Simulado do Aluno',
        profile: MEDIUM_PROFILE,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          username: TEST_STUDENT_USERNAME,
          requester: {
            id: teacherId,
            username: TEST_TEACHER_USERNAME,
            role: ROLES.TEACHER,
          },
        }),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as MockExamDto[];
      expect(body).toHaveLength(1);
      expect(body[0].authorId).toBe(studentId);
    });
  });

  describe('GET /api/mock-exams/users/:username — error cases', () => {
    it('should return 400 when no username param is provided', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          requester: {
            id: studentId,
            username: TEST_STUDENT_USERNAME,
            role: ROLES.STUDENT,
          },
        }),
      );

      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when the username has an invalid format', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          username: '-invalido',
          requester: {
            id: studentId,
            username: TEST_STUDENT_USERNAME,
            role: ROLES.STUDENT,
          },
        }),
      );

      expect(response.statusCode).toBe(400);
    });

    it('should return 404 when the target username does not exist', async () => {
      const adminId = await createUser({
        name: 'Admin Teste',
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          username: 'usuario.inexistente.teste',
          requester: {
            id: adminId,
            username: TEST_ADMIN_USERNAME,
            role: ROLES.ADMIN,
          },
        }),
      );

      expect(response.statusCode).toBe(404);
    });

    it('should return 403 when a TEACHER tries to view a STUDENT not assigned to them', async () => {
      const teacherId = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      await createMockExam({
        authorId: studentId,
        title: 'Simulado do Aluno',
        profile: MEDIUM_PROFILE,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          username: TEST_STUDENT_USERNAME,
          requester: {
            id: teacherId,
            username: TEST_TEACHER_USERNAME,
            role: ROLES.TEACHER,
          },
        }),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 403 when a STUDENT tries to view another STUDENT statistics', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createUser({
        name: 'Aluno Teste Dois',
        username: TEST_STUDENT2_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          username: TEST_STUDENT2_USERNAME,
          requester: {
            id: studentId,
            username: TEST_STUDENT_USERNAME,
            role: ROLES.STUDENT,
          },
        }),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 403 when a STUDENT tries to view a TEACHER statistics (lower role accessing higher role)', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          username: TEST_TEACHER_USERNAME,
          requester: {
            id: studentId,
            username: TEST_STUDENT_USERNAME,
            role: ROLES.STUDENT,
          },
        }),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 403 when a TEACHER tries to view another TEACHER statistics (equal role)', async () => {
      const teacherId = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      await createUser({
        name: 'Professor Teste Dois',
        username: TEST_TEACHER2_USERNAME,
        role: ROLES.TEACHER,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          username: TEST_TEACHER2_USERNAME,
          requester: {
            id: teacherId,
            username: TEST_TEACHER_USERNAME,
            role: ROLES.TEACHER,
          },
        }),
      );

      expect(response.statusCode).toBe(403);
    });
  });
});
