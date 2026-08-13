import { randomUUID } from 'node:crypto';

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { QuestionSessionDto } from '@/src/core/application/common/dtos';
import { ROLES, type Role } from '@/src/core/domain/auth';
import type { Requester } from '@/src/core/domain/services';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makeSetIsReviewed } from '@/src/core/main/factories/question-session/make-set-is-reviewed.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const TEST_PASSWORD = 'Senha@123';
let cachedPasswordHash: string;

const PREFIX = 'sir';

const STUDENT_USERNAME = `${PREFIX}.student.teste`;
const STUDENT2_USERNAME = `${PREFIX}.student2.teste`;
const TEACHER_USERNAME = `${PREFIX}.teacher.teste`;
const TEACHER2_USERNAME = `${PREFIX}.teacher2.teste`;
const ADMIN_USERNAME = `${PREFIX}.admin.teste`;

const ALL_TEST_USERNAMES = [
  STUDENT_USERNAME,
  STUDENT2_USERNAME,
  TEACHER_USERNAME,
  TEACHER2_USERNAME,
  ADMIN_USERNAME,
];

const SUBJECT_SLUG = `${PREFIX}-subject-teste`;

let topicId: string;
let subjectId: string;

function makeSut() {
  return makeSetIsReviewed();
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
      passwordHash: cachedPasswordHash,
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

async function createQuestionSession(data: {
  authorId: string;
  total: number;
  correct: number;
  isReviewed?: boolean;
  date?: Date;
}) {
  return prisma.questionSession.create({
    data: {
      authorId: data.authorId,
      topicId,
      total: data.total,
      correct: data.correct,
      isReviewed: data.isReviewed ?? false,
      ...(data.date ? { date: data.date } : {}),
    },
  });
}

function requesterFor(id: string, username: string, role: Role): Requester {
  return { id, username, role };
}

type BodyType = { isReviewed: boolean };

function makeRequest(options: {
  questionSessionId?: string;
  body?: unknown;
  requester: Requester;
}): AuthenticatedRequest<BodyType, { questionSessionId: string }> {
  return {
    body: (options.body ?? {}) as BodyType,
    params: { questionSessionId: options.questionSessionId as string },
    requester: options.requester,
  };
}

beforeAll(async () => {
  await prisma.$connect();

  const bcrypt = makeBcryptAdapter();
  cachedPasswordHash = await bcrypt.hash(TEST_PASSWORD);

  const subject = await prisma.subject.create({
    data: {
      name: 'Matemática SIR Teste',
      slug: SUBJECT_SLUG,
      topics: {
        create: { title: 'Tópico SIR Teste', position: 1 },
      },
    },
    include: { topics: true },
  });

  subjectId = subject.id;
  topicId = subject.topics[0].id;
});

afterEach(async () => {
  await prisma.user.deleteMany({
    where: { username: { in: ALL_TEST_USERNAMES } },
  });
});

afterAll(async () => {
  await prisma.subject.delete({ where: { id: subjectId } });
  await prisma.$disconnect();
});

describe('SetIsReviewedController (integration)', () => {
  describe('PATCH /api/question-sessions/:questionSessionId — success cases', () => {
    it('should allow a STUDENT to mark their own question session as reviewed and persist in database', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const session = await createQuestionSession({
        authorId: studentId,
        total: 10,
        correct: 9,
        isReviewed: false,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          questionSessionId: session.id,
          body: { isReviewed: true },
          requester: requesterFor(studentId, STUDENT_USERNAME, ROLES.STUDENT),
        }),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as QuestionSessionDto;
      expect(body.id).toBe(session.id);
      expect(body.isReviewed).toBe(true);

      const updated = await prisma.questionSession.findUniqueOrThrow({
        where: { id: session.id },
      });
      expect(updated.isReviewed).toBe(true);
    });

    it('should allow toggling isReviewed back to false', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const fixedDate = new Date('2026-01-01T00:00:00.000Z');
      const session = await createQuestionSession({
        authorId: studentId,
        total: 10,
        correct: 9,
        isReviewed: true,
        date: fixedDate,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          questionSessionId: session.id,
          body: { isReviewed: false },
          requester: requesterFor(studentId, STUDENT_USERNAME, ROLES.STUDENT),
        }),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as QuestionSessionDto;
      expect(body.isReviewed).toBe(false);
      expect(body.nextReviewDate).not.toBeNull();
    });

    it('should allow a TEACHER to update a session of an assigned STUDENT', async () => {
      const teacherId = await createUser({
        name: 'Professor Teste',
        username: TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await linkStudentToTeacher(studentId, teacherId);

      const session = await createQuestionSession({
        authorId: studentId,
        total: 10,
        correct: 6,
        isReviewed: false,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          questionSessionId: session.id,
          body: { isReviewed: true },
          requester: requesterFor(teacherId, TEACHER_USERNAME, ROLES.TEACHER),
        }),
      );

      expect(response.statusCode).toBe(200);
      expect((response.body as QuestionSessionDto).isReviewed).toBe(true);
    });

    it('should allow an ADMIN to update a STUDENT session without an explicit link', async () => {
      const adminId = await createUser({
        name: 'Admin Teste',
        username: ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const session = await createQuestionSession({
        authorId: studentId,
        total: 10,
        correct: 6,
        isReviewed: false,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          questionSessionId: session.id,
          body: { isReviewed: true },
          requester: requesterFor(adminId, ADMIN_USERNAME, ROLES.ADMIN),
        }),
      );

      expect(response.statusCode).toBe(200);
      expect((response.body as QuestionSessionDto).isReviewed).toBe(true);
    });
  });

  describe('PATCH /api/question-sessions/:questionSessionId — error cases', () => {
    it('should return 403 when a TEACHER tries to update an unassigned STUDENT session', async () => {
      const teacherId = await createUser({
        name: 'Professor Teste',
        username: TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const session = await createQuestionSession({
        authorId: studentId,
        total: 10,
        correct: 6,
        isReviewed: false,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          questionSessionId: session.id,
          body: { isReviewed: true },
          requester: requesterFor(teacherId, TEACHER_USERNAME, ROLES.TEACHER),
        }),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 403 when a STUDENT tries to update another STUDENT session', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const student2Id = await createUser({
        name: 'Aluno Teste Dois',
        username: STUDENT2_USERNAME,
        role: ROLES.STUDENT,
      });
      const session = await createQuestionSession({
        authorId: student2Id,
        total: 10,
        correct: 6,
        isReviewed: false,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          questionSessionId: session.id,
          body: { isReviewed: true },
          requester: requesterFor(studentId, STUDENT_USERNAME, ROLES.STUDENT),
        }),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 404 when the question session does not exist', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          questionSessionId: randomUUID(),
          body: { isReviewed: true },
          requester: requesterFor(studentId, STUDENT_USERNAME, ROLES.STUDENT),
        }),
      );

      expect(response.statusCode).toBe(404);
    });

    it('should return 400 when questionSessionId is not a valid UUID', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest({
          questionSessionId: 'not-a-valid-uuid',
          body: { isReviewed: true },
          requester: requesterFor(studentId, STUDENT_USERNAME, ROLES.STUDENT),
        }),
      );

      expect(response.statusCode).toBe(400);
    });
  });
});
