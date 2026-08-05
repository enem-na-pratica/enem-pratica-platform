import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { MockExamDto } from '@/src/core/application/common/dtos';
import type { CreateMockExamDto } from '@/src/core/application/use-cases/mock-exam';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeCreateMockExam } from '@/src/core/main/factories/mock-exam/make-create-mock-exam.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

describe('CreateMockExamController (integration)', () => {
  describe('POST /api/mock-exams/users/:username — success cases', () => {});

  describe('POST /api/mock-exams/users/:username — error cases', () => {});
});

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
