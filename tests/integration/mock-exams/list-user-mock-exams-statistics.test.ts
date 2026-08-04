import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { UserMockExamsOverviewDto } from '@/src/core/application/use-cases/mock-exam';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeListUserMockExamsStatistics } from '@/src/core/main/factories/mock-exam/make-list-user-mock-exams-statistics.factory';
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
  return makeListUserMockExamsStatistics();
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
