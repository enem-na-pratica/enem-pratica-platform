import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { MockExamStatsDto } from '@/src/core/application/use-cases/mock-exam';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeGetAuthorMockExamStats } from '@/src/core/main/factories/mock-exam/make-get-author-mock-exam-stats.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

type AreaPerformanceInput = {
  correctCount: number;
  certaintyCount: number;
  doubtErrors: number;
  distractionErrors: number;
  interpretationErrors: number;
};

type AreaKey = 'LANGUAGES' | 'HUMANITIES' | 'NATURAL_SCIENCES' | 'MATHEMATICS';

type TestUser = { id: string; username: string; role: Role };

const TEST_STUDENT_USERNAME = 'aluno.statsmockexam.teste';
const TEST_STUDENT2_USERNAME = 'aluno2.statsmockexam.teste';
const TEST_TEACHER_USERNAME = 'professor.statsmockexam.teste';
const TEST_TEACHER2_USERNAME = 'professor2.statsmockexam.teste';
const TEST_ADMIN_USERNAME = 'admin.statsmockexam.teste';

const ALL_TEST_USERNAMES = [
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
  TEST_TEACHER_USERNAME,
  TEST_TEACHER2_USERNAME,
  TEST_ADMIN_USERNAME,
];

function makeSut() {
  return makeGetAuthorMockExamStats();
}

async function createUser(data: {
  name: string;
  username: string;
  role: Role;
}): Promise<TestUser> {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      passwordHash: 'fake-hash-for-tests',
      role: data.role,
    },
  });

  return { id: user.id, username: user.username, role: user.role as Role };
}

async function linkStudentToTeacher(
  studentId: string,
  teacherId: string,
): Promise<void> {
  await prisma.studentTeacher.create({
    data: { studentId, teacherId },
  });
}

async function createMockExam(
  authorId: string,
  title: string,
  performances: Record<AreaKey, AreaPerformanceInput>,
): Promise<string> {
  const mockExam = await prisma.mockExam.create({
    data: {
      title,
      authorId,
      performances: {
        create: (Object.keys(performances) as AreaKey[]).map((area) => ({
          // Type cast required in case the Prisma-generated enum is not
          // structurally compatible with a string literal union.
          area: area as AreaKey & string,
          ...performances[area],
        })),
      },
    },
  });

  return mockExam.id;
}

function makeRequest(
  username: string,
  requester: TestUser,
): AuthenticatedRequest<void, { username: string }> {
  return {
    body: undefined,
    params: { username },
    requester,
  };
}

const PERFECT_PERFORMANCES: Record<AreaKey, AreaPerformanceInput> = {
  LANGUAGES: {
    correctCount: 45,
    certaintyCount: 45,
    doubtErrors: 0,
    distractionErrors: 0,
    interpretationErrors: 0,
  },
  HUMANITIES: {
    correctCount: 45,
    certaintyCount: 45,
    doubtErrors: 0,
    distractionErrors: 0,
    interpretationErrors: 0,
  },
  NATURAL_SCIENCES: {
    correctCount: 45,
    certaintyCount: 45,
    doubtErrors: 0,
    distractionErrors: 0,
    interpretationErrors: 0,
  },
  MATHEMATICS: {
    correctCount: 45,
    certaintyCount: 45,
    doubtErrors: 0,
    distractionErrors: 0,
    interpretationErrors: 0,
  },
};

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

describe('GetAuthorMockExamStatsController (integration)', () => {
  describe('GET /api/mock-exams/users/:username/stats — success cases', () => {
    it('should return zeroed statistics when the author has no mock exams', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle(makeRequest('me', student));

      expect(response.statusCode).toBe(200);

      const body = response.body as MockExamStatsDto;
      expect(body.totalMockExams).toBe(0);
      expect(body.globalAveragePerformance).toBe(0);
      expect(body.errorPrevalence).toEqual({
        distractionAverage: 0,
        interpretationAverage: 0,
        knowledgeGapAverage: 0,
      });

      (
        ['languages', 'humanities', 'naturalSciences', 'mathematics'] as const
      ).forEach((area) => {
        expect(body.performancePerArea[area]).toEqual({
          averagePerformanceRate: 0,
          averageCorrectAnswers: 0,
          totalCriticalErrors: 0,
        });
      });
    });

    it('should correctly aggregate statistics across multiple mock exams', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      await createMockExam(student.id, 'Simulado 1', {
        LANGUAGES: {
          correctCount: 45,
          certaintyCount: 45,
          doubtErrors: 0,
          distractionErrors: 0,
          interpretationErrors: 0,
        },
        HUMANITIES: {
          correctCount: 30,
          certaintyCount: 25,
          doubtErrors: 3,
          distractionErrors: 5,
          interpretationErrors: 4,
        },
        NATURAL_SCIENCES: {
          correctCount: 20,
          certaintyCount: 15,
          doubtErrors: 5,
          distractionErrors: 10,
          interpretationErrors: 5,
        },
        MATHEMATICS: {
          correctCount: 10,
          certaintyCount: 8,
          doubtErrors: 10,
          distractionErrors: 15,
          interpretationErrors: 10,
        },
      });

      await createMockExam(student.id, 'Simulado 2', {
        LANGUAGES: {
          correctCount: 35,
          certaintyCount: 30,
          doubtErrors: 2,
          distractionErrors: 5,
          interpretationErrors: 3,
        },
        HUMANITIES: {
          correctCount: 40,
          certaintyCount: 35,
          doubtErrors: 1,
          distractionErrors: 2,
          interpretationErrors: 2,
        },
        NATURAL_SCIENCES: {
          correctCount: 25,
          certaintyCount: 20,
          doubtErrors: 4,
          distractionErrors: 8,
          interpretationErrors: 6,
        },
        MATHEMATICS: {
          correctCount: 15,
          certaintyCount: 10,
          doubtErrors: 8,
          distractionErrors: 12,
          interpretationErrors: 8,
        },
      });

      const controller = makeSut();
      const response = await controller.handle(makeRequest('me', student));

      expect(response.statusCode).toBe(200);

      const body = response.body as MockExamStatsDto;

      expect(body.totalMockExams).toBe(2);
      // (80/45 + 70/45 + 45/45 + 25/45) / (2 * 4) ≈ 0.61111
      expect(body.globalAveragePerformance).toBeCloseTo(0.61111, 4);

      expect(
        body.performancePerArea.languages.averagePerformanceRate,
      ).toBeCloseTo(0.88889, 4); // (45+35)/45/2
      expect(body.performancePerArea.languages.averageCorrectAnswers).toBe(40); // (45+35)/2
      expect(body.performancePerArea.languages.totalCriticalErrors).toBe(8); // (90-80) - (0+2)

      expect(
        body.performancePerArea.humanities.averagePerformanceRate,
      ).toBeCloseTo(0.77778, 4); // (30+40)/45/2
      expect(body.performancePerArea.humanities.averageCorrectAnswers).toBe(35); // (30+40)/2
      expect(body.performancePerArea.humanities.totalCriticalErrors).toBe(16); // (90-70) - (3+1)

      expect(
        body.performancePerArea.naturalSciences.averagePerformanceRate,
      ).toBeCloseTo(0.5, 4); // (20+25)/45/2
      expect(
        body.performancePerArea.naturalSciences.averageCorrectAnswers,
      ).toBe(22.5); // (20+25)/2
      expect(body.performancePerArea.naturalSciences.totalCriticalErrors).toBe(
        36,
      ); // (90-45) - (5+4)

      expect(
        body.performancePerArea.mathematics.averagePerformanceRate,
      ).toBeCloseTo(0.27778, 4); // (10+15)/45/2
      expect(body.performancePerArea.mathematics.averageCorrectAnswers).toBe(
        12.5,
      ); // (10+15)/2
      expect(body.performancePerArea.mathematics.totalCriticalErrors).toBe(47); // (90-25) - (10+8)

      expect(body.errorPrevalence.distractionAverage).toBe(28.5); // (5+7+18+27)/2
      expect(body.errorPrevalence.interpretationAverage).toBe(19); // (3+6+11+18)/2
      expect(body.errorPrevalence.knowledgeGapAverage).toBe(22.5); // (2+7+16+20)/2
    });

    it('should allow a TEACHER to access the stats of a STUDENT explicitly assigned to them', async () => {
      const teacher = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await linkStudentToTeacher(student.id, teacher.id);

      await createMockExam(
        student.id,
        'Simulado do Aluno',
        PERFECT_PERFORMANCES,
      );

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest(TEST_STUDENT_USERNAME, teacher),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as MockExamStatsDto;
      expect(body.totalMockExams).toBe(1);
      expect(body.globalAveragePerformance).toBe(1);
    });

    it('should allow an ADMIN to access statistics of any subordinate user, even without an explicit link', async () => {
      const admin = await createUser({
        name: 'Admin Teste',
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });
      await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest(TEST_TEACHER_USERNAME, admin),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as MockExamStatsDto;
      expect(body.totalMockExams).toBe(0);
    });

    it('should allow a requester to access their own stats by passing their own username directly (not "me")', async () => {
      const teacher = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest(TEST_TEACHER_USERNAME, teacher),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as MockExamStatsDto;
      expect(body.totalMockExams).toBe(0);
    });
  });

  describe('GET /api/mock-exams/users/:username/stats — error cases', () => {
    it('should return 403 when a TEACHER tries to access a STUDENT that is not assigned to them', async () => {
      const teacher = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      // No StudentTeacher link is created intentionally.

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest(TEST_STUDENT_USERNAME, teacher),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 403 when a STUDENT tries to access another STUDENT statistics', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createUser({
        name: 'Aluno Dois Teste',
        username: TEST_STUDENT2_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest(TEST_STUDENT2_USERNAME, student),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 403 when a STUDENT tries to access a TEACHER statistics (lower role targeting a higher one)', async () => {
      const student = await createUser({
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
        makeRequest(TEST_TEACHER_USERNAME, student),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 403 when a TEACHER tries to access another TEACHER statistics (equal role level)', async () => {
      const teacher = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      await createUser({
        name: 'Professor Dois Teste',
        username: TEST_TEACHER2_USERNAME,
        role: ROLES.TEACHER,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest(TEST_TEACHER2_USERNAME, teacher),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 400 when the provided username has an invalid format', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest('-invalido', student),
      );

      expect(response.statusCode).toBe(400);
    });
  });
});
