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
