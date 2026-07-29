import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { UserEssaysOverviewDto } from '@/src/core/application/use-cases/essay';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeListUserEssaysStatistics } from '@/src/core/main/factories/essay/make-list-user-essays-statistics.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

type Requester = { id: string; username: string; role: Role };
type ListUserEssaysStatisticsParam = { username: string };

const TEST_TEACHER_USERNAME = 'teacher.essays.teste';
const TEST_TEACHER2_USERNAME = 'teacher2.essays.teste';
const TEST_STUDENT_USERNAME = 'student.essays.teste';
const TEST_STUDENT2_USERNAME = 'student2.essays.teste';
const TEST_ADMIN_USERNAME = 'admin.essays.teste';

const ALL_TEST_USERNAMES = [
  TEST_TEACHER_USERNAME,
  TEST_TEACHER2_USERNAME,
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
  TEST_ADMIN_USERNAME,
];

function makeSut() {
  return makeListUserEssaysStatistics();
}

async function createUser(data: {
  name: string;
  username: string;
  role: Role;
}): Promise<Requester> {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      passwordHash: 'hashed_password_teste',
      role: data.role,
    },
  });

  return { id: user.id, username: user.username, role: user.role };
}

async function linkStudentToTeacher(
  studentId: string,
  teacherId: string,
): Promise<void> {
  await prisma.studentTeacher.create({
    data: { studentId, teacherId },
  });
}

type EssayOverrides = {
  theme?: string;
  c1?: number;
  c2?: number;
  c3?: number;
  c4?: number;
  c5?: number;
  createdAt?: Date;
};

async function createEssay(authorId: string, overrides: EssayOverrides = {}) {
  return prisma.essay.create({
    data: {
      authorId,
      theme: overrides.theme ?? 'Tema de redação teste',
      competency1: overrides.c1 ?? 100,
      competency2: overrides.c2 ?? 100,
      competency3: overrides.c3 ?? 100,
      competency4: overrides.c4 ?? 100,
      competency5: overrides.c5 ?? 100,
      ...(overrides.createdAt ? { createdAt: overrides.createdAt } : {}),
    },
  });
}

function makeRequest(
  usernameParam: string,
  requester: Requester,
): AuthenticatedRequest<void, ListUserEssaysStatisticsParam> {
  return {
    body: undefined,
    params: { username: usernameParam },
    requester,
  };
}

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  await prisma.essay.deleteMany({
    where: { author: { username: { in: ALL_TEST_USERNAMES } } },
  });
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
