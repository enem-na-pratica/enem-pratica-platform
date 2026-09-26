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
