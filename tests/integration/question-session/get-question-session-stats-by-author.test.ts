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

beforeAll(async () => {
  await prisma.$connect();

  cachedPasswordHash = await makeBcryptAdapter().hash(TEST_PASSWORD);

  await prisma.subject.deleteMany({ where: { slug: TEST_SUBJECT_SLUG } });
  const subject = await prisma.subject.create({
    data: {
      name: 'Assunto Stats Integration',
      slug: TEST_SUBJECT_SLUG,
      topics: { create: { title: 'Topico Stats Integration', position: 1 } },
    },
    include: { topics: true },
  });
  topicId = subject.topics[0].id;
});

afterEach(async () => {
  await prisma.user.deleteMany({
    where: { username: { in: ALL_TEST_USERNAMES } },
  });
});

afterAll(async () => {
  await prisma.subject.deleteMany({ where: { slug: TEST_SUBJECT_SLUG } });
  await prisma.$disconnect();
});

describe('GetQuestionSessionStatsByAuthorController (integration)', () => {
  describe('GET /api/question-sessions/users/:username/stats — success cases', () => {
    it('should return 200 with all-zero statistics when the user has no sessions', async () => {
      const student = await createUser(USERNAMES.student, ROLES.STUDENT);

      const response = await makeSut().handle(makeRequest(student, 'me'));

      expect(response.statusCode).toBe(200);
      expect(asStats(response.body)).toEqual({
        totalSessions: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        overallAccuracy: 0,
        weeklyProgress: { totalQuestions: 0, accuracy: 0 },
        studyStreak: 0,
        pendingReviewsCount: 0,
      });
    });
  });
  describe('GET /api/question-sessions/users/:username/stats — error cases', () => {});
});
