import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { QuestionSessionStatsDto } from '@/src/core/application/use-cases/question-session';
import { ROLES, type Role } from '@/src/core/domain/auth';
import type { Requester } from '@/src/core/domain/services';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makeGetQuestionSessionStatsByAuthor } from '@/src/core/main/factories/question-session/make-get-question-session-stats-by-author.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const DAY_MS = 24 * 60 * 60 * 1000;
const TEST_PASSWORD = 'Senha@123';
let cachedPasswordHash: string;

const TEST_SUBJECT_SLUG = 'qs-stats-integration-subject';
let topicId: string;

const USERNAMES = {
  student: 'student.qsstats.teste',
  student2: 'student2.qsstats.teste',
  teacher: 'teacher.qsstats.teste',
  admin: 'admin.qsstats.teste',
} as const;

const ALL_TEST_USERNAMES = Object.values(USERNAMES);

function makeSut() {
  return makeGetQuestionSessionStatsByAuthor();
}

async function createUser(username: string, role: Role): Promise<Requester> {
  const user = await prisma.user.create({
    data: {
      name: 'Usuario Teste',
      username,
      passwordHash: cachedPasswordHash,
      role,
    },
  });

  return { id: user.id, username: user.username, role: user.role as Role };
}

async function linkStudentToTeacher(studentId: string, teacherId: string) {
  await prisma.studentTeacher.create({ data: { studentId, teacherId } });
}

function daysAgo(days: number): Date {
  const base = new Date();
  base.setUTCHours(12, 0, 0, 0);
  return new Date(base.getTime() - days * DAY_MS);
}

async function createSession(params: {
  authorId: string;
  date: Date;
  total: number;
  correct: number;
  isReviewed?: boolean;
}) {
  const { isReviewed = true, ...rest } = params;
  return prisma.questionSession.create({
    data: { topicId, isReviewed, ...rest },
  });
}

function makeRequest(
  requester: Requester,
  username?: string,
): AuthenticatedRequest<void, { username: string }> {
  return {
    body: undefined,
    params: username === undefined ? undefined : { username },
    requester,
  };
}

function asStats(body: unknown) {
  return body as QuestionSessionStatsDto;
}
