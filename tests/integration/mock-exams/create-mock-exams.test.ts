import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { MockExamDto } from '@/src/core/application/common/dtos';
import type { CreateMockExamDto } from '@/src/core/application/use-cases/mock-exam';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeCreateMockExam } from '@/src/core/main/factories/mock-exam/make-create-mock-exam.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

type Requester = { id: string; username: string; role: Role };

type CreateMockExamRequestBody = Omit<CreateMockExamDto, 'authorUsername'>;

const TEST_STUDENT_USERNAME = 'aluno.mockexam.teste';
const TEST_OTHER_STUDENT_USERNAME = 'aluno2.mockexam.teste';
const TEST_TEACHER_USERNAME = 'professor.mockexam.teste';
const TEST_TEACHER2_USERNAME = 'professor2.mockexam.teste';
const TEST_ADMIN_USERNAME = 'admin.mockexam.teste';

const ALL_TEST_USERNAMES = [
  TEST_STUDENT_USERNAME,
  TEST_OTHER_STUDENT_USERNAME,
  TEST_TEACHER_USERNAME,
  TEST_TEACHER2_USERNAME,
  TEST_ADMIN_USERNAME,
];

function makeSut() {
  return makeCreateMockExam();
}

function makeRequest({
  body,
  requester,
  username,
}: {
  body: Partial<CreateMockExamDto>;
  requester: Requester;
  username?: string;
}): AuthenticatedRequest<CreateMockExamDto, { username: string }> {
  return {
    body: body as CreateMockExamDto,
    params: username ? { username } : undefined,
    requester,
  };
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
      passwordHash: 'irrelevant-hash-for-tests',
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

function requesterFrom(
  userId: string,
  username: string,
  role: Role,
): Requester {
  return { id: userId, username, role };
}

function validPerformance() {
  return {
    correctCount: 30,
    certaintyCount: 20,
    doubtErrors: 5,
    distractionErrors: 5,
    interpretationErrors: 5,
  };
}

function validPerformances(): CreateMockExamRequestBody['performances'] {
  return {
    languages: validPerformance(),
    humanities: validPerformance(),
    naturalSciences: validPerformance(),
    mathematics: validPerformance(),
  };
}

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  await prisma.user.deleteMany({
    where: { username: { in: ALL_TEST_USERNAMES } },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('CreateMockExamController (integration)', () => {
  describe('POST /api/mock-exams/users/:username — success cases', () => {
    it('should return 201 and create a mock exam for the requester themself (params.username = "me")', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const requester = requesterFrom(
        studentId,
        TEST_STUDENT_USERNAME,
        ROLES.STUDENT,
      );
      const { controller } = { controller: makeSut() };

      const response = await controller.handle(
        makeRequest({
          username: 'me',
          requester,
          body: {
            title: 'Simulado ENEM 2026',
            performances: validPerformances(),
          },
        }),
      );

      expect(response.statusCode).toBe(201);

      const mockExam = response.body as MockExamDto;
      expect(mockExam.id).toBeTruthy();
      expect(mockExam.authorId).toBe(studentId);
      expect(mockExam.title).toBe('Simulado ENEM 2026');
      expect(typeof mockExam.createdAt).toBe('string');
      expect(Object.keys(mockExam.performances).sort()).toEqual(
        ['humanities', 'languages', 'mathematics', 'naturalSciences'].sort(),
      );
    });

    it('should return 201 and create a mock exam for the requester when no params.username is provided', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const requester = requesterFrom(
        studentId,
        TEST_STUDENT_USERNAME,
        ROLES.STUDENT,
      );
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          requester,
          body: {
            title: 'Simulado sem params',
            performances: validPerformances(),
          },
        }),
      );

      expect(response.statusCode).toBe(201);
      expect((response.body as MockExamDto).authorId).toBe(studentId);
    });

    it('should persist the mock exam and all four area performances in the database', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const requester = requesterFrom(
        studentId,
        TEST_STUDENT_USERNAME,
        ROLES.STUDENT,
      );
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          username: 'me',
          requester,
          body: {
            title: 'Simulado Persistido',
            performances: validPerformances(),
          },
        }),
      );

      expect(response.statusCode).toBe(201);
      const created = response.body as MockExamDto;

      const persisted = await prisma.mockExam.findUnique({
        where: { id: created.id },
        include: { performances: true },
      });

      expect(persisted).not.toBeNull();
      expect(persisted?.title).toBe('Simulado Persistido');
      expect(persisted?.authorId).toBe(studentId);
      expect(persisted?.performances).toHaveLength(4);

      const areas = persisted?.performances.map((p) => p.area).sort();
      expect(areas).toEqual(
        ['LANGUAGES', 'HUMANITIES', 'NATURAL_SCIENCES', 'MATHEMATICS'].sort(),
      );
    });

    it('should correctly compute the derived statistics for each area', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const requester = requesterFrom(
        studentId,
        TEST_STUDENT_USERNAME,
        ROLES.STUDENT,
      );
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          username: 'me',
          requester,
          body: {
            title: 'Simulado Estatísticas',
            performances: validPerformances(),
          },
        }),
      );

      expect(response.statusCode).toBe(201);
      const mockExam = response.body as MockExamDto;
      const languages = mockExam.performances.languages;

      expect(languages.statistics.overallResult).toEqual({
        totalQuestions: 45,
        correctAnswers: 30,
        wrongAnswers: 15,
        performanceRate: 30 / 45,
      });
      expect(languages.statistics.qualityAssessment).toEqual({
        certaintyHits: 20,
        confidenceRate: 20 / 30,
        doubtHits: 10,
        doubtErrors: 5,
        criticalErrors: 10,
      });
      expect(languages.statistics.errorAnalysis).toEqual({
        distractionErrors: 5,
        interpretationErrors: 5,
        knowledgeGapsErrors: 5,
      });
    });

    it('should allow a TEACHER to create a mock exam for a student explicitly assigned to them', async () => {
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

      const requester = requesterFrom(
        teacherId,
        TEST_TEACHER_USERNAME,
        ROLES.TEACHER,
      );
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          username: TEST_STUDENT_USERNAME,
          requester,
          body: {
            title: 'Simulado do Aluno',
            performances: validPerformances(),
          },
        }),
      );

      expect(response.statusCode).toBe(201);
      expect((response.body as MockExamDto).authorId).toBe(studentId);
    });

    it('should allow an ADMIN to create a mock exam for any user, even without an explicit link', async () => {
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

      const requester = requesterFrom(
        adminId,
        TEST_ADMIN_USERNAME,
        ROLES.ADMIN,
      );
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          username: TEST_STUDENT_USERNAME,
          requester,
          body: {
            title: 'Simulado via Admin',
            performances: validPerformances(),
          },
        }),
      );

      expect(response.statusCode).toBe(201);
      expect((response.body as MockExamDto).authorId).toBe(studentId);
    });
  });

  describe('POST /api/mock-exams/users/:username — error cases', () => {
    it('should return 403 when a TEACHER tries to create a mock exam for a student NOT assigned to them', async () => {
      const teacherId = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      await createUser({
        name: 'Aluno Não Vinculado',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const requester = requesterFrom(
        teacherId,
        TEST_TEACHER_USERNAME,
        ROLES.TEACHER,
      );
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          username: TEST_STUDENT_USERNAME,
          requester,
          body: {
            title: 'Simulado Indevido',
            performances: validPerformances(),
          },
        }),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 403 when a STUDENT tries to create a mock exam for another user', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createUser({
        name: 'Outro Aluno',
        username: TEST_OTHER_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const requester = requesterFrom(
        studentId,
        TEST_STUDENT_USERNAME,
        ROLES.STUDENT,
      );
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          username: TEST_OTHER_STUDENT_USERNAME,
          requester,
          body: {
            title: 'Simulado Indevido',
            performances: validPerformances(),
          },
        }),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 403 when a TEACHER tries to create a mock exam for another TEACHER (same role level)', async () => {
      const teacherId = await createUser({
        name: 'Professor Um',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      await createUser({
        name: 'Professor Dois',
        username: TEST_TEACHER2_USERNAME,
        role: ROLES.TEACHER,
      });

      const requester = requesterFrom(
        teacherId,
        TEST_TEACHER_USERNAME,
        ROLES.TEACHER,
      );
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          username: TEST_TEACHER2_USERNAME,
          requester,
          body: {
            title: 'Simulado Indevido',
            performances: validPerformances(),
          },
        }),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 404 when the target authorUsername does not exist', async () => {
      const adminId = await createUser({
        name: 'Admin Teste',
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });

      const requester = requesterFrom(
        adminId,
        TEST_ADMIN_USERNAME,
        ROLES.ADMIN,
      );
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          username: 'usuario.que.nao.existe',
          requester,
          body: {
            title: 'Simulado Fantasma',
            performances: validPerformances(),
          },
        }),
      );

      expect(response.statusCode).toBe(404);
    });

    it('should return 400 when the body is empty or missing required fields', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const requester = requesterFrom(
        studentId,
        TEST_STUDENT_USERNAME,
        ROLES.STUDENT,
      );

      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({ username: 'me', requester, body: {} }),
      );

      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when performance metrics are invalid (e.g., correctCount out of bounds)', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const requester = requesterFrom(
        studentId,
        TEST_STUDENT_USERNAME,
        ROLES.STUDENT,
      );
      const controller = makeSut();

      const performances = validPerformances();
      performances.languages.correctCount = 100;

      const response = await controller.handle(
        makeRequest({
          username: 'me',
          requester,
          body: { title: 'Simulado Inválido', performances },
        }),
      );

      expect(response.statusCode).toBe(400);
    });
  });
});
