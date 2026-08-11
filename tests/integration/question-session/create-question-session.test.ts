import { randomUUID } from 'node:crypto';

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { QuestionSessionDto } from '@/src/core/application/common/dtos';
import type { CreateQuestionSessionDto } from '@/src/core/application/use-cases/question-session/create-question-session';
import { ROLES, type Role } from '@/src/core/domain/auth';
import type { Requester } from '@/src/core/domain/services';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makeCreateQuestionSession } from '@/src/core/main/factories/question-session/make-create-question-session.factory';
import type {
  AuthenticatedRequest,
  ErrorResponse,
} from '@/src/core/presentation/protocols';

const TEST_PASSWORD = 'Senha@123';
let cachedPasswordHash: string;

const TEST_STUDENT_USERNAME = 'aluno.qs.teste';
const TEST_TEACHER_USERNAME = 'professor.qs.teste';
const TEST_ADMIN_USERNAME = 'admin.qs.teste';

const ALL_TEST_USERNAMES = [
  TEST_STUDENT_USERNAME,
  TEST_TEACHER_USERNAME,
  TEST_ADMIN_USERNAME,
];

const TEST_SUBJECT_SLUG = 'matematica-qs-teste';
const TEST_SUBJECT_NAME = 'Matemática QS Teste';

function makeSut() {
  return makeCreateQuestionSession();
}

async function createUser(data: {
  name: string;
  username: string;
  role: Role;
}): Promise<{ id: string; username: string; role: Role }> {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      passwordHash: cachedPasswordHash,
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

async function createTopic(): Promise<string> {
  const subject = await prisma.subject.upsert({
    where: { slug: TEST_SUBJECT_SLUG },
    update: {},
    create: {
      name: TEST_SUBJECT_NAME,
      slug: TEST_SUBJECT_SLUG,
    },
  });

  const topic = await prisma.topic.create({
    data: {
      title: `Tópico QS Teste ${randomUUID()}`,
      position: 1,
      subjectId: subject.id,
    },
  });

  return topic.id;
}

function toRequester(user: {
  id: string;
  username: string;
  role: Role;
}): Requester {
  return { id: user.id, username: user.username, role: user.role };
}

type CreateQuestionSessionRequestBody = Omit<
  CreateQuestionSessionDto,
  'authorUsername'
>;
type CreateQuestionSessionRequestParam = { username: string };

function makeRequest(params: {
  body?: Record<string, unknown>;
  routeUsername?: string;
  requester: Requester;
}): AuthenticatedRequest<
  CreateQuestionSessionRequestBody,
  CreateQuestionSessionRequestParam
> {
  return {
    body: (params.body ?? {}) as unknown as CreateQuestionSessionRequestBody,
    params:
      params.routeUsername !== undefined
        ? { username: params.routeUsername }
        : undefined,
    requester: params.requester,
  };
}

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const diffMs = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(diffMs / (24 * 60 * 60 * 1000));
}

beforeAll(async () => {
  await prisma.$connect();
  const bcrypt = makeBcryptAdapter();
  cachedPasswordHash = await bcrypt.hash(TEST_PASSWORD);
});

afterEach(async () => {
  await prisma.user.deleteMany({
    where: { username: { in: ALL_TEST_USERNAMES } },
  });
  await prisma.subject.deleteMany({ where: { slug: TEST_SUBJECT_SLUG } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('CreateQuestionSessionController (integration)', () => {
  describe('POST /api/question-sessions/users/:username — success cases', () => {
    it('should return 201 and create a question session for the requester when username param is "me"', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const topicId = await createTopic();
      const controller = makeSut();
      const date = todayDateString();

      const response = await controller.handle(
        makeRequest({
          routeUsername: 'me',
          requester: toRequester(student),
          body: { topicId, date, total: 10, correct: 7 },
        }),
      );

      expect(response.statusCode).toBe(201);

      const body = response.body as QuestionSessionDto;
      expect(body.authorId).toBe(student.id);
      expect(body.topicId).toBe(topicId);
      expect(body.total).toBe(10);
      expect(body.correct).toBe(7);
      expect(body.incorrect).toBe(3);
      expect(body.performance).toBeCloseTo(0.7);
      expect(body.isReviewed).toBe(false);
      expect(body.id).toBeTruthy();
      expect(body.createdAt).toBeTruthy();
      expect(body.updatedAt).toBeTruthy();
    });

    it('should allow a TEACHER to create a question session for an assigned student (by username)', async () => {
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
      const topicId = await createTopic();
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          routeUsername: student.username,
          requester: toRequester(teacher),
          body: { topicId, date: todayDateString(), total: 8, correct: 6 },
        }),
      );

      expect(response.statusCode).toBe(201);
      const body = response.body as QuestionSessionDto;
      expect(body.authorId).toBe(student.id);
    });
  });
});
