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
  });

  describe('GET /api/essays/users/:username/stats — error cases', () => {});
});
