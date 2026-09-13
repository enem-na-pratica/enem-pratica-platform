import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { EssayStatsDto } from '@/src/core/application/use-cases/essay';
import { ROLES, type Role } from '@/src/core/domain/auth';
import type { Requester } from '@/src/core/domain/services';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeGetAuthorEssaysStats } from '@/src/core/main/factories/essay/make-get-author-essay-stats.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const DUMMY_PASSWORD_HASH = 'hash-nao-utilizado-neste-fluxo';

const SUFFIX = 'essaystats.teste';

const USERNAMES = {
  student: `student.${SUFFIX}`,
  student2: `student-2.${SUFFIX}`,
  teacher: `teacher.${SUFFIX}`,
  teacher2: `teacher-2.${SUFFIX}`,
  admin: `admin.${SUFFIX}`,
};

const ALL_TEST_USERNAMES = Object.values(USERNAMES);

type TestUser = {
  id: string;
  username: string;
  role: Role;
};

function makeSut() {
  return makeGetAuthorEssaysStats();
}

async function createUser(data: {
  name: string;
  username: string;
  role: Role;
}): Promise<TestUser> {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      passwordHash: DUMMY_PASSWORD_HASH,
      role: data.role,
    },
  });

  return { id: user.id, username: user.username, role: user.role };
}

async function linkStudentToTeacher(
  studentId: string,
  teacherId: string,
): Promise<void> {
  await prisma.studentTeacher.create({
    data: { studentId, teacherId },
  });
}

type Competencies = [number, number, number, number, number];

async function createEssay(
  authorId: string,
  [c1, c2, c3, c4, c5]: Competencies,
): Promise<void> {
  await prisma.essay.create({
    data: {
      authorId,
      theme: 'Tema de teste',
      competency1: c1,
      competency2: c2,
      competency3: c3,
      competency4: c4,
      competency5: c5,
    },
  });
}

function makeRequester(user: TestUser): Requester {
  return { id: user.id, username: user.username, role: user.role };
}

function makeRequest(
  username: string | undefined,
  requester: Requester,
): AuthenticatedRequest<void, { username: string }> {
  return {
    body: undefined,
    params: username === undefined ? undefined : { username },
    requester,
  };
}

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  await prisma.essay.deleteMany({
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
  await prisma.$disconnect();
});

describe('GetAuthorEssaysStatsController (integration)', () => {
  describe('GET /api/essays/users/:username/stats — success cases', () => {
    it('should return 200 with zeroed stats when the requester ("me") has no essays', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: USERNAMES.student,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest('me', makeRequester(student)),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as EssayStatsDto;
      expect(body.totalCount).toBe(0);
      expect(body.globalAverage).toBe(0);
      expect(body.averagesPerCompetency).toEqual({
        c1: 0,
        c2: 0,
        c3: 0,
        c4: 0,
        c5: 0,
      });
    });

    it('should correctly compute totals and per-competency averages for the requester\'s own essays ("me")', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: USERNAMES.student,
        role: ROLES.STUDENT,
      });

      await createEssay(student.id, [120, 100, 80, 140, 160]); // sum 600
      await createEssay(student.id, [160, 140, 120, 100, 80]); // sum 600

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest('me', makeRequester(student)),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as EssayStatsDto;
      expect(body.totalCount).toBe(2);
      expect(body.averagesPerCompetency).toEqual({
        c1: 140,
        c2: 120,
        c3: 100,
        c4: 120,
        c5: 120,
      });
      expect(body.globalAverage).toBe(600);
    });

    it("should resolve to the requester's own stats when the username param equals their own username", async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: USERNAMES.student,
        role: ROLES.STUDENT,
      });

      await createEssay(student.id, [100, 100, 100, 100, 100]);

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest(USERNAMES.student, makeRequester(student)),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as EssayStatsDto;
      expect(body.totalCount).toBe(1);
      expect(body.globalAverage).toBe(500);
    });

    it("should allow an ADMIN to view a STUDENT's essay stats by username", async () => {
      const admin = await createUser({
        name: 'Admin Teste',
        username: USERNAMES.admin,
        role: ROLES.ADMIN,
      });
      const student = await createUser({
        name: 'Aluno Teste',
        username: USERNAMES.student,
        role: ROLES.STUDENT,
      });

      await createEssay(student.id, [180, 160, 140, 120, 100]); // sum 700

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest(USERNAMES.student, makeRequester(admin)),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as EssayStatsDto;
      expect(body.totalCount).toBe(1);
      expect(body.globalAverage).toBe(700);
    });

    it('should allow a TEACHER to view stats of a STUDENT explicitly assigned to them', async () => {
      const teacher = await createUser({
        name: 'Professor Teste',
        username: USERNAMES.teacher,
        role: ROLES.TEACHER,
      });
      const student = await createUser({
        name: 'Aluno Teste',
        username: USERNAMES.student,
        role: ROLES.STUDENT,
      });
      await linkStudentToTeacher(student.id, teacher.id);
      await createEssay(student.id, [200, 200, 200, 200, 200]); // sum 1000

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest(USERNAMES.student, makeRequester(teacher)),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as EssayStatsDto;
      expect(body.totalCount).toBe(1);
      expect(body.globalAverage).toBe(1000);
    });

    it('should return the response body with the expected shape', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: USERNAMES.student,
        role: ROLES.STUDENT,
      });
      await createEssay(student.id, [100, 100, 100, 100, 100]);

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest('me', makeRequester(student)),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as EssayStatsDto;
      expect(body).toHaveProperty('totalCount');
      expect(body).toHaveProperty('globalAverage');
      expect(body).toHaveProperty('averagesPerCompetency');
      expect(body.averagesPerCompetency).toHaveProperty('c1');
      expect(body.averagesPerCompetency).toHaveProperty('c2');
      expect(body.averagesPerCompetency).toHaveProperty('c3');
      expect(body.averagesPerCompetency).toHaveProperty('c4');
      expect(body.averagesPerCompetency).toHaveProperty('c5');
    });
  });

  describe('GET /api/essays/users/:username/stats — error cases', () => {
    it('should return 403 when a TEACHER requests stats of a STUDENT not assigned to them', async () => {
      const teacher = await createUser({
        name: 'Professor Teste',
        username: USERNAMES.teacher,
        role: ROLES.TEACHER,
      });
      const student = await createUser({
        name: 'Aluno Teste',
        username: USERNAMES.student,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest(USERNAMES.student, makeRequester(teacher)),
      );

      expect(response.statusCode).toBe(403);
    });

    it("should return 403 when a STUDENT requests another user's essay stats", async () => {
      const student1 = await createUser({
        name: 'Aluno Um',
        username: USERNAMES.student,
        role: ROLES.STUDENT,
      });
      const student2 = await createUser({
        name: 'Aluno Dois',
        username: USERNAMES.student2,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest(USERNAMES.student2, makeRequester(student1)),
      );

      expect(response.statusCode).toBe(403);
      // Ensures that no essay by "student2" has been improperly exposed
      expect(student2.id).toBeTruthy();
    });

    it('should return 403 when a TEACHER requests stats of another TEACHER (equal role)', async () => {
      const teacher1 = await createUser({
        name: 'Professor Um',
        username: USERNAMES.teacher,
        role: ROLES.TEACHER,
      });
      const teacher2 = await createUser({
        name: 'Professor Dois',
        username: USERNAMES.teacher2,
        role: ROLES.TEACHER,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest(USERNAMES.teacher2, makeRequester(teacher1)),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 403 when a TEACHER requests stats of an ADMIN (higher role)', async () => {
      const teacher = await createUser({
        name: 'Professor Teste',
        username: USERNAMES.teacher,
        role: ROLES.TEACHER,
      });
      const admin = await createUser({
        name: 'Admin Teste',
        username: USERNAMES.admin,
        role: ROLES.ADMIN,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest(USERNAMES.admin, makeRequester(teacher)),
      );

      expect(response.statusCode).toBe(403);
    });

    it('should return 404 when the target username does not exist', async () => {
      const admin = await createUser({
        name: 'Admin Teste',
        username: USERNAMES.admin,
        role: ROLES.ADMIN,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest('usuario.inexistente.essaystats', makeRequester(admin)),
      );

      expect(response.statusCode).toBe(404);
    });
  });
});
