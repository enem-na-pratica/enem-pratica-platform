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

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  await prisma.subject.deleteMany({
    where: { slug: { in: [SUBJECT_SLUG, EMPTY_SUBJECT_SLUG] } },
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
  await prisma.$disconnect();
});

describe('ListSubjectProgressController (integration)', () => {
  describe('GET /api/subjects/:subjectSlug/topics/users/:username — success cases', () => {
    it("should resolve the requester's own progress when username param is 'me'", async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const { topicIds } = await createSubjectWithTopics(SUBJECT_SLUG, [
        { title: 'Funções', position: 1 },
      ]);
      await createProgress(studentId, topicIds[0], 'REVIEW');

      const controller = makeSut();
      const requester = makeRequester({
        id: studentId,
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const response = await controller.handle(
        makeRequest({ requester, subjectSlug: SUBJECT_SLUG, username: 'me' }),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as TopicProgressDto[];
      expect(body).toHaveLength(1);
      expect(body[0].progress?.status).toBe(TOPIC_STATUS.REVIEW);
    });

    it('should return 200 with an empty array when the subject has no topics', async () => {
      await createSubjectWithTopics(EMPTY_SUBJECT_SLUG, []);
      const controller = makeSut();
      const requester = makeRequester();

      const response = await controller.handle(
        makeRequest({ requester, subjectSlug: EMPTY_SUBJECT_SLUG }),
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return the topics ordered by position, ascending', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createSubjectWithTopics(SUBJECT_SLUG, [
        { title: 'Terceiro Tópico', position: 3 },
        { title: 'Primeiro Tópico', position: 1 },
        { title: 'Segundo Tópico', position: 2 },
      ]);

      const controller = makeSut();
      const requester = makeRequester({
        id: studentId,
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const response = await controller.handle(
        makeRequest({ requester, subjectSlug: SUBJECT_SLUG }),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as TopicProgressDto[];
      expect(body.map((entry) => entry.topic.title)).toEqual([
        'Primeiro Tópico',
        'Segundo Tópico',
        'Terceiro Tópico',
      ]);
    });

    it("should include the requester's own progress record for a topic when it exists", async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const { topicIds } = await createSubjectWithTopics(SUBJECT_SLUG, [
        { title: 'Funções', position: 1 },
      ]);
      await createProgress(studentId, topicIds[0], 'COMPREHENDED');

      const controller = makeSut();
      const requester = makeRequester({
        id: studentId,
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const response = await controller.handle(
        makeRequest({ requester, subjectSlug: SUBJECT_SLUG }),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as TopicProgressDto[];
      expect(body).toHaveLength(1);
      expect(body[0].progress).not.toBeNull();
      expect(body[0].progress?.status).toBe(TOPIC_STATUS.COMPREHENDED);
      expect(body[0].progress?.authorId).toBe(studentId);
      expect(body[0].progress?.topicId).toBe(topicIds[0]);
    });

    it("should not leak another user's progress for the same topic", async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const otherStudentId = await createUser({
        name: 'Outro Aluno Teste',
        username: TEST_STUDENT2_USERNAME,
        role: ROLES.STUDENT,
      });
      const { topicIds } = await createSubjectWithTopics(SUBJECT_SLUG, [
        { title: 'Funções', position: 1 },
      ]);
      await createProgress(otherStudentId, topicIds[0], 'COMPREHENDED');

      const controller = makeSut();
      const requester = makeRequester({
        id: studentId,
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const response = await controller.handle(
        makeRequest({ requester, subjectSlug: SUBJECT_SLUG }),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as TopicProgressDto[];
      expect(body).toHaveLength(1);
      expect(body[0].progress).toBeNull();
    });

    it('should allow a TEACHER to list the progress of a student explicitly assigned to them', async () => {
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
      const { topicIds } = await createSubjectWithTopics(SUBJECT_SLUG, [
        { title: 'Funções', position: 1 },
      ]);
      await createProgress(studentId, topicIds[0], 'PRACTICE');

      const controller = makeSut();
      const requester = makeRequester({
        id: teacherId,
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });

      const response = await controller.handle(
        makeRequest({
          requester,
          subjectSlug: SUBJECT_SLUG,
          username: TEST_STUDENT_USERNAME,
        }),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as TopicProgressDto[];
      expect(body).toHaveLength(1);
      expect(body[0].progress?.authorId).toBe(studentId);
    });

    it('should allow an ADMIN to list the progress of any student, even without an explicit assignment', async () => {
      const adminId = await createUser({
        name: 'Admin Teste',
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });
      await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createSubjectWithTopics(SUBJECT_SLUG, [
        { title: 'Funções', position: 1 },
      ]);

      const controller = makeSut();
      const requester = makeRequester({
        id: adminId,
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });

      const response = await controller.handle(
        makeRequest({
          requester,
          subjectSlug: SUBJECT_SLUG,
          username: TEST_STUDENT_USERNAME,
        }),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as TopicProgressDto[];
      expect(body).toHaveLength(1);
    });

    it('should return the correct shape for each entry (topic + progress DTOs)', async () => {
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const { topicIds } = await createSubjectWithTopics(SUBJECT_SLUG, [
        { title: 'Funções', position: 1 },
      ]);
      await createProgress(studentId, topicIds[0], 'COMPREHENDED');

      const controller = makeSut();
      const requester = makeRequester({
        id: studentId,
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const response = await controller.handle(
        makeRequest({ requester, subjectSlug: SUBJECT_SLUG }),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as TopicProgressDto[];
      const [entry] = body;

      expect(entry).toHaveProperty('topic');
      expect(entry).toHaveProperty('progress');
      expect(entry.topic).toMatchObject({
        id: topicIds[0],
        title: 'Funções',
        position: 1,
      });
      expect(entry.progress).toMatchObject({
        authorId: studentId,
        topicId: topicIds[0],
        status: TOPIC_STATUS.COMPREHENDED,
      });
      expect(typeof entry.progress?.createdAt).toBe('string');
      expect(typeof entry.progress?.updatedAt).toBe('string');
    });
  });

  describe('GET /api/subjects/:subjectSlug/topics/users/:username — error cases', () => {
    it('should return 403 when a TEACHER tries to access a student who is not assigned to them', async () => {
      const teacherId = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const requester = makeRequester({
        id: teacherId,
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });

      const response = await controller.handle(
        makeRequest({
          requester,
          subjectSlug: SUBJECT_SLUG,
          username: TEST_STUDENT_USERNAME,
        }),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 403 when a STUDENT tries to access another STUDENT', async () => {
      const student1Id = await createUser({
        name: 'Aluno Um',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createUser({
        name: 'Aluno Dois',
        username: TEST_STUDENT2_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const requester = makeRequester({
        id: student1Id,
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const response = await controller.handle(
        makeRequest({
          requester,
          subjectSlug: SUBJECT_SLUG,
          username: TEST_STUDENT2_USERNAME,
        }),
      );

      expect(response.statusCode).toBe(403);
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
          requester,
          subjectSlug: SUBJECT_SLUG,
          username: 'nao.existe.teste',
        }),
      );

      expect(response.statusCode).toBe(404);
    });
  });
});
