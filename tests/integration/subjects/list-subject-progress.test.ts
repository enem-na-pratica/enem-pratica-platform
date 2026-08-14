import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { TopicProgressDto } from '@/src/core/application/use-cases/subject/list-subject-progress';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { TOPIC_STATUS } from '@/src/core/domain/entities';
import type { Requester } from '@/src/core/domain/services';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeListSubjectProgress } from '@/src/core/main/factories/subject/make-list-subject-progress.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const TEST_STUDENT_USERNAME = 'aluno.progresso.teste';
const TEST_STUDENT2_USERNAME = 'aluno-dois.progresso.teste';
const TEST_TEACHER_USERNAME = 'professor.progresso.teste';
const TEST_TEACHER2_USERNAME = 'professor-dois.progresso.teste';
const TEST_ADMIN_USERNAME = 'admin.progresso.teste';

const ALL_TEST_USERNAMES = [
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
  TEST_TEACHER_USERNAME,
  TEST_TEACHER2_USERNAME,
  TEST_ADMIN_USERNAME,
];

const SUBJECT_SLUG = 'matematica-progresso-teste';
const EMPTY_SUBJECT_SLUG = 'fisica-progresso-teste-vazio';

type ListSubjectProgressParam = { subjectSlug: string; username: string };
type ListSubjectProgressQuery = { status: string | string[] };

function makeSut() {
  return makeListSubjectProgress();
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
      passwordHash: 'irrelevant-hash-for-this-suite',
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

async function createSubjectWithTopics(
  slug: string,
  topics: { title: string; position: number }[] = [],
): Promise<{ subjectId: string; topicIds: string[] }> {
  const subject = await prisma.subject.create({
    data: { name: slug, slug },
  });

  const topicIds: string[] = [];
  for (const topic of topics) {
    const created = await prisma.topic.create({
      data: {
        title: topic.title,
        position: topic.position,
        subjectId: subject.id,
      },
    });
    topicIds.push(created.id);
  }

  return { subjectId: subject.id, topicIds };
}

async function createProgress(
  authorId: string,
  topicId: string,
  status: keyof typeof TOPIC_STATUS,
): Promise<void> {
  await prisma.userTopicProgress.create({
    data: {
      authorId,
      topicId,
      status: TOPIC_STATUS[status],
    },
  });
}

function makeRequester(overrides: Partial<Requester> = {}): Requester {
  return {
    id: crypto.randomUUID(),
    username: 'requester.fake.teste',
    role: ROLES.STUDENT,
    ...overrides,
  };
}

function makeRequest({
  requester,
  subjectSlug,
  username = 'me',
  status,
}: {
  requester: Requester;
  subjectSlug?: string;
  username?: string;
  status?: string | string[];
}): AuthenticatedRequest<
  void,
  ListSubjectProgressParam,
  ListSubjectProgressQuery
> {
  return {
    body: undefined,
    requester,
    params: {
      subjectSlug: subjectSlug as string,
      username: username as string,
    },
    query: status !== undefined ? { status } : undefined,
  };
}
