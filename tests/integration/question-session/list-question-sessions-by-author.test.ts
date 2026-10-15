import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { QuestionSessionExtendedDto } from '@/src/core/application/use-cases/question-session';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeListQuestionSessionsByAuthor } from '@/src/core/main/factories/question-session';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const DUMMY_PASSWORD_HASH = 'irrelevant-hash-for-this-suite';

const SUBJECT_NAME = 'QSS Integration Test Subject';
const SUBJECT_SLUG = 'qss-integration-test-subject';
const TOPIC_TITLE = 'QSS Integration Test Topic';

const STUDENT_USERNAME = 'student.qss.teste';
const STUDENT2_USERNAME = 'student2.qss.teste';
const TEACHER_USERNAME = 'teacher.qss.teste';
const ADMIN_USERNAME = 'admin.qss.teste';

const ALL_TEST_USERNAMES = [
  STUDENT_USERNAME,
  STUDENT2_USERNAME,
  TEACHER_USERNAME,
  ADMIN_USERNAME,
];

type TestUser = { id: string; username: string; role: Role };

function makeSut() {
  return makeListQuestionSessionsByAuthor();
}

function startOfToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

async function createUser(data: {
  username: string;
  role: Role;
  name?: string;
}): Promise<TestUser> {
  const user = await prisma.user.create({
    data: {
      name: data.name ?? 'Usuário Teste',
      username: data.username,
      passwordHash: DUMMY_PASSWORD_HASH,
      role: data.role,
    },
  });

  return { id: user.id, username: user.username, role: user.role as Role };
}

async function linkStudentToTeacher(
  studentId: string,
  teacherId: string,
): Promise<void> {
  await prisma.studentTeacher.create({ data: { studentId, teacherId } });
}

async function ensureSubjectAndTopic(): Promise<{
  subjectId: string;
  topicId: string;
}> {
  const subject = await prisma.subject.upsert({
    where: { slug: SUBJECT_SLUG },
    update: {},
    create: { name: SUBJECT_NAME, slug: SUBJECT_SLUG, category: 'TEST' },
  });

  const existingTopic = await prisma.topic.findFirst({
    where: { subjectId: subject.id, title: TOPIC_TITLE },
  });

  const topic =
    existingTopic ??
    (await prisma.topic.create({
      data: { title: TOPIC_TITLE, position: 1, subjectId: subject.id },
    }));

  return { subjectId: subject.id, topicId: topic.id };
}

type CreateSessionInput = {
  authorId: string;
  topicId: string;
  total: number;
  correct: number;
  date?: Date;
  isReviewed?: boolean;
  updatedAt?: Date;
};

async function createQuestionSession(input: CreateSessionInput) {
  return prisma.questionSession.create({
    data: {
      authorId: input.authorId,
      topicId: input.topicId,
      total: input.total,
      correct: input.correct,
      date: input.date,
      isReviewed: input.isReviewed ?? false,
      updatedAt: input.updatedAt,
    },
  });
}

function makeRequest({
  requester,
  username,
}: {
  requester: TestUser;
  username?: string;
}): AuthenticatedRequest<void, { username: string }> {
  return {
    body: undefined,
    params: username === undefined ? undefined : { username },
    requester,
  } as AuthenticatedRequest<void, { username: string }>;
}

async function cleanupTestData(): Promise<void> {
  await prisma.questionSession.deleteMany({
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
}

let topicId: string;

beforeAll(async () => {
  await prisma.$connect();
  await cleanupTestData();
  const refs = await ensureSubjectAndTopic();
  topicId = refs.topicId;
});

afterEach(async () => {
  await cleanupTestData();
});

afterAll(async () => {
  await prisma.topic.deleteMany({ where: { id: topicId } });
  await prisma.subject.deleteMany({ where: { slug: SUBJECT_SLUG } });
  await prisma.$disconnect();
});

describe('ListQuestionSessionsByAuthorController (integration)', () => {
  describe('GET /api/question-sessions/users/:username — success cases', () => {
    it('should return question sessions for the requester when username is "me" or matches the requester username', async () => {
      const student = await createUser({
        username: STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createQuestionSession({
        authorId: student.id,
        topicId,
        total: 10,
        correct: 7,
      });

      const controller = makeSut();

      const resMe = await controller.handle(
        makeRequest({ requester: student, username: 'me' }),
      );
      const resUsername = await controller.handle(
        makeRequest({ requester: student, username: STUDENT_USERNAME }),
      );

      expect(resMe.statusCode).toBe(200);
      expect(resUsername.statusCode).toBe(200);
      expect(resMe.body).toHaveLength(1);
      expect(resUsername.body).toHaveLength(1);
    });

    it('should allow authorized users (ADMIN and assigned TEACHER) to view student statistics', async () => {
      const admin = await createUser({
        username: ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });
      const teacher = await createUser({
        username: TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      const student = await createUser({
        username: STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      await linkStudentToTeacher(student.id, teacher.id);
      await createQuestionSession({
        authorId: student.id,
        topicId,
        total: 5,
        correct: 5,
      });

      const controller = makeSut();

      const adminRes = await controller.handle(
        makeRequest({ requester: admin, username: STUDENT_USERNAME }),
      );
      const teacherRes = await controller.handle(
        makeRequest({ requester: teacher, username: STUDENT_USERNAME }),
      );

      expect(adminRes.statusCode).toBe(200);
      expect(teacherRes.statusCode).toBe(200);
    });

    it('should return empty sessions list when user has no sessions', async () => {
      const student = await createUser({
        username: STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({ requester: student, username: 'me' }),
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    it('should order sessions by pending review date ascending first, then reviewed sessions by updatedAt descending', async () => {
      const student = await createUser({
        username: STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const today = startOfToday();

      const sessionFarReview = await createQuestionSession({
        authorId: student.id,
        topicId,
        total: 10,
        correct: 10,
        isReviewed: false,
        date: today,
      });
      const sessionNearReview = await createQuestionSession({
        authorId: student.id,
        topicId,
        total: 10,
        correct: 5,
        isReviewed: false,
        date: today,
      });
      const sessionReviewedNewer = await createQuestionSession({
        authorId: student.id,
        topicId,
        total: 10,
        correct: 10,
        isReviewed: true,
        date: today,
        updatedAt: new Date(),
      });
      const sessionReviewedOlder = await createQuestionSession({
        authorId: student.id,
        topicId,
        total: 10,
        correct: 10,
        isReviewed: true,
        date: today,
        updatedAt: new Date(Date.now() - 3600000),
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({ requester: student, username: 'me' }),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as QuestionSessionExtendedDto[];
      const orderedIds = body.map((s) => s.id);

      expect(orderedIds).toEqual([
        sessionNearReview.id,
        sessionFarReview.id,
        sessionReviewedNewer.id,
        sessionReviewedOlder.id,
      ]);
    });
  });

  describe('GET /api/question-sessions/users/:username — error cases', () => {
    it('should return 400 when username param is missing or invalid', async () => {
      const student = await createUser({
        username: STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const controller = makeSut();

      const resMissing = await controller.handle(
        makeRequest({ requester: student }),
      );
      const resInvalid = await controller.handle(
        makeRequest({ requester: student, username: '-invalido' }),
      );

      expect(resMissing.statusCode).toBe(400);
      expect(resInvalid.statusCode).toBe(400);
    });

    it('should return 404 when target username does not exist', async () => {
      const student = await createUser({
        username: STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({ requester: student, username: 'usuario.nao.existe' }),
      );

      expect(response.statusCode).toBe(404);
    });

    it('should return 403 when a STUDENT tries to view another user question sessions', async () => {
      const student1 = await createUser({
        username: STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createUser({ username: STUDENT2_USERNAME, role: ROLES.STUDENT });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({ requester: student1, username: STUDENT2_USERNAME }),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 403 when a TEACHER tries to view an unassigned STUDENT question sessions', async () => {
      const teacher = await createUser({
        username: TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      await createUser({ username: STUDENT_USERNAME, role: ROLES.STUDENT });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({ requester: teacher, username: STUDENT_USERNAME }),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 403 when a TEACHER tries to view another TEACHER question sessions', async () => {
      const teacher = await createUser({
        username: TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      await createUser({
        username: 'other.teacher.qss.teste',
        role: ROLES.TEACHER,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          requester: teacher,
          username: 'other.teacher.qss.teste',
        }),
      );

      expect(response.statusCode).toBe(403);
    });
  });
});
