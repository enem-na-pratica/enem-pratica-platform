import { randomUUID } from 'crypto';

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { ROLES, type Role } from '@/src/core/domain/auth';
import { TOPIC_STATUS } from '@/src/core/domain/entities';
import type { Requester } from '@/src/core/domain/services';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makeSetTopicStatus } from '@/src/core/main/factories/user-topic-progress/make-set-topic-status.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const TEST_PASSWORD = 'Senha@123';
let cachedPasswordHash: string;

const TEST_STUDENT_USERNAME = 'student.settopicstatus.teste';
const TEST_STUDENT2_USERNAME = 'student2.settopicstatus.teste';
const TEST_TEACHER_USERNAME = 'teacher.settopicstatus.teste';
const TEST_TEACHER2_USERNAME = 'teacher2.settopicstatus.teste';
const TEST_ADMIN_USERNAME = 'admin.settopicstatus.teste';

const ALL_TEST_USERNAMES = [
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
  TEST_TEACHER_USERNAME,
  TEST_TEACHER2_USERNAME,
  TEST_ADMIN_USERNAME,
];

const TEST_SUBJECT_SLUG = 'subject-set-topic-status-teste';

let testTopicId: string;
let testTopic2Id: string;

type RequestBody = Partial<{ topicId: string; status: string }>;

function makeSut() {
  return makeSetTopicStatus();
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

function makeRequester({
  id,
  username,
  role,
}: {
  id: string;
  username: string;
  role: Role;
}): Requester {
  return { id, username, role };
}

function makeRequest({
  body,
  username,
  requester,
}: {
  body: RequestBody;
  username?: string;
  requester: Requester;
}): AuthenticatedRequest<
  { topicId: string; status: (typeof TOPIC_STATUS)[keyof typeof TOPIC_STATUS] },
  { username: string }
> {
  return {
    body: body as {
      topicId: string;
      status: (typeof TOPIC_STATUS)[keyof typeof TOPIC_STATUS];
    },
    params:
      username !== undefined
        ? ({ username } as { username: string })
        : undefined,
    requester,
  };
}

async function countProgressRows(authorId: string, topicId: string) {
  return prisma.userTopicProgress.count({ where: { authorId, topicId } });
}

beforeAll(async () => {
  await prisma.$connect();

  const bcrypt = makeBcryptAdapter();
  cachedPasswordHash = await bcrypt.hash(TEST_PASSWORD);

  const subject = await prisma.subject.create({
    data: { name: 'Subject SetTopicStatus Teste', slug: TEST_SUBJECT_SLUG },
  });

  const topic = await prisma.topic.create({
    data: {
      title: 'Topic SetTopicStatus Teste',
      position: 1,
      subjectId: subject.id,
    },
  });
  testTopicId = topic.id;

  const topic2 = await prisma.topic.create({
    data: {
      title: 'Topic 2 SetTopicStatus Teste',
      position: 2,
      subjectId: subject.id,
    },
  });
  testTopic2Id = topic2.id;
});

afterEach(async () => {
  await prisma.userTopicProgress.deleteMany({
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
  await prisma.topic.deleteMany({
    where: { subject: { slug: TEST_SUBJECT_SLUG } },
  });
  await prisma.subject.deleteMany({ where: { slug: TEST_SUBJECT_SLUG } });
  await prisma.$disconnect();
});

describe('SetTopicStatusController (integration)', () => {
  describe('POST /api/user-topic-progress/users/:username — success cases', () => {
    it("should let a STUDENT set their own topic status via username 'me'", async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const controller = makeSut();
      const requester = makeRequester({
        id: studentId,
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const response = await controller.handle(
        makeRequest({
          body: { topicId: testTopicId, status: TOPIC_STATUS.PRACTICE },
          username: 'me',
          requester,
        }),
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        authorId: studentId,
        topicId: testTopicId,
        status: TOPIC_STATUS.PRACTICE,
      });
    });

    it('should let a STUDENT set their own topic status when no username param is provided', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const controller = makeSut();
      const requester = makeRequester({
        id: studentId,
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const response = await controller.handle(
        makeRequest({
          body: { topicId: testTopicId, status: TOPIC_STATUS.REVIEW },
          requester,
        }),
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        authorId: studentId,
        status: TOPIC_STATUS.REVIEW,
      });
    });

    it('should let a STUDENT set their own topic status by passing their own username explicitly', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const controller = makeSut();
      const requester = makeRequester({
        id: studentId,
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const response = await controller.handle(
        makeRequest({
          body: { topicId: testTopicId, status: TOPIC_STATUS.COMPREHENDED },
          username: TEST_STUDENT_USERNAME,
          requester,
        }),
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({ authorId: studentId });
    });

    it('should upsert instead of duplicating when the same author/topic pair is set twice', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const controller = makeSut();
      const requester = makeRequester({
        id: studentId,
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const firstResponse = await controller.handle(
        makeRequest({
          body: { topicId: testTopicId, status: TOPIC_STATUS.PRACTICE },
          username: 'me',
          requester,
        }),
      );

      const secondResponse = await controller.handle(
        makeRequest({
          body: { topicId: testTopicId, status: TOPIC_STATUS.COMPREHENDED },
          username: 'me',
          requester,
        }),
      );

      expect(firstResponse.statusCode).toBe(200);
      expect(secondResponse.statusCode).toBe(200);

      const firstBody = firstResponse.body as { id: string };
      const secondBody = secondResponse.body as {
        id: string;
        status: string;
      };

      expect(secondBody.id).toBe(firstBody.id);
      expect(secondBody.status).toBe(TOPIC_STATUS.COMPREHENDED);

      const rowCount = await countProgressRows(studentId, testTopicId);
      expect(rowCount).toBe(1);
    });

    it('should let a TEACHER set the topic status of a student assigned to them (by username)', async () => {
      const teacherId = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await linkStudentToTeacher(studentId, teacherId);

      const controller = makeSut();
      const requester = makeRequester({
        id: teacherId,
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });

      const response = await controller.handle(
        makeRequest({
          body: { topicId: testTopicId, status: TOPIC_STATUS.PRACTICE },
          username: TEST_STUDENT_USERNAME,
          requester,
        }),
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({ authorId: studentId });
    });

    it('should let a TEACHER set the topic status of an assigned student using the student id', async () => {
      const teacherId = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await linkStudentToTeacher(studentId, teacherId);

      const controller = makeSut();
      const requester = makeRequester({
        id: teacherId,
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });

      const response = await controller.handle(
        makeRequest({
          body: { topicId: testTopicId, status: TOPIC_STATUS.PRACTICE },
          username: studentId,
          requester,
        }),
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({ authorId: studentId });
    });

    it('should let an ADMIN set the topic status of a student even without an explicit assignment', async () => {
      const adminId = await createUser({
        name: 'Admin Teste',
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const requester = makeRequester({
        id: adminId,
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });

      const response = await controller.handle(
        makeRequest({
          body: { topicId: testTopic2Id, status: TOPIC_STATUS.REVIEW },
          username: TEST_STUDENT_USERNAME,
          requester,
        }),
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({ authorId: studentId });
    });

    it('should return the full UserTopicProgressDto shape', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const controller = makeSut();
      const requester = makeRequester({
        id: studentId,
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const response = await controller.handle(
        makeRequest({
          body: { topicId: testTopicId, status: TOPIC_STATUS.PRACTICE },
          username: 'me',
          requester,
        }),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as Record<string, unknown>;
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('authorId', studentId);
      expect(body).toHaveProperty('topicId', testTopicId);
      expect(body).toHaveProperty('status', TOPIC_STATUS.PRACTICE);
      expect(typeof body.createdAt).toBe('string');
      expect(typeof body.updatedAt).toBe('string');
      expect(() => new Date(body.createdAt as string)).not.toThrow();
    });
  });

  describe('POST /api/user-topic-progress/users/:username — error cases', () => {
    it('should return 400 when body parameters are invalid', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const controller = makeSut();
      const requester = makeRequester({
        id: studentId,
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const response = await controller.handle(
        makeRequest({
          body: { topicId: 'invalid-uuid', status: 'INVALID_STATUS' },
          username: 'me',
          requester,
        }),
      );

      expect(response.statusCode).toBe(400);

      const rowCount = await countProgressRows(studentId, testTopicId);
      expect(rowCount).toBe(0);
    });

    it('should return 404 when the target username does not exist', async () => {
      const teacherId = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      const controller = makeSut();
      const requester = makeRequester({
        id: teacherId,
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });

      const response = await controller.handle(
        makeRequest({
          body: { topicId: testTopicId, status: TOPIC_STATUS.PRACTICE },
          username: 'nao.existe.teste',
          requester,
        }),
      );

      expect(response.statusCode).toBe(404);
    });
  });
});
