import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { EssayPaginatedResponse } from '@/src/core/application/use-cases/essay/list-essays';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makeListEssays } from '@/src/core/main/factories/essay/make-list-essays.factory';
import type {
  AuthenticatedRequest,
  ErrorResponse,
} from '@/src/core/presentation/protocols';

const TEST_PASSWORD = 'Senha@123';
let cachedPasswordHash: string;

const TEST_STUDENT_USERNAME = 'student.essays.teste';
const TEST_STUDENT2_USERNAME = 'student2.essays.teste';
const TEST_TEACHER_USERNAME = 'teacher.essays.teste';
const TEST_ADMIN_USERNAME = 'admin.essays.teste';

const ALL_TEST_USERNAMES = [
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
  TEST_TEACHER_USERNAME,
  TEST_ADMIN_USERNAME,
];

type TestRequester = { id: string; username: string; role: Role };

type ValidationErrorBody = ErrorResponse<Record<string, string[]>>;

function makeSut() {
  return makeListEssays();
}

async function createUser(data: {
  name: string;
  username: string;
  role: Role;
}): Promise<TestRequester> {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      passwordHash: cachedPasswordHash,
      role: data.role,
    },
  });

  return { id: user.id, username: user.username, role: data.role };
}

async function linkStudentToTeacher(
  studentId: string,
  teacherId: string,
): Promise<void> {
  await prisma.studentTeacher.create({ data: { studentId, teacherId } });
}

async function createEssay(
  authorId: string,
  data: {
    theme: string;
    createdAt?: Date;
    grades?: [number, number, number, number, number];
  },
) {
  const [c1, c2, c3, c4, c5] = data.grades ?? [120, 120, 120, 120, 120];

  return prisma.essay.create({
    data: {
      authorId,
      theme: data.theme,
      competency1: c1,
      competency2: c2,
      competency3: c3,
      competency4: c4,
      competency5: c5,
      ...(data.createdAt && { createdAt: data.createdAt }),
    },
  });
}
