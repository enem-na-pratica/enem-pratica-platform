import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { UserEssaysOverviewDto } from '@/src/core/application/use-cases/essay';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeListUserEssaysStatistics } from '@/src/core/main/factories/essay/make-list-user-essays-statistics.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

type Requester = { id: string; username: string; role: Role };
type ListUserEssaysStatisticsParam = { username: string };

const TEST_TEACHER_USERNAME = 'teacher.essays.teste';
const TEST_TEACHER2_USERNAME = 'teacher2.essays.teste';
const TEST_STUDENT_USERNAME = 'student.essays.teste';
const TEST_STUDENT2_USERNAME = 'student2.essays.teste';
const TEST_ADMIN_USERNAME = 'admin.essays.teste';

const ALL_TEST_USERNAMES = [
  TEST_TEACHER_USERNAME,
  TEST_TEACHER2_USERNAME,
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
  TEST_ADMIN_USERNAME,
];

function makeSut() {
  return makeListUserEssaysStatistics();
}

async function createUser(data: {
  name: string;
  username: string;
  role: Role;
}): Promise<Requester> {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      passwordHash: 'hashed_password_teste',
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

type EssayOverrides = {
  theme?: string;
  c1?: number;
  c2?: number;
  c3?: number;
  c4?: number;
  c5?: number;
  createdAt?: Date;
};

async function createEssay(authorId: string, overrides: EssayOverrides = {}) {
  return prisma.essay.create({
    data: {
      authorId,
      theme: overrides.theme ?? 'Tema de redação teste',
      competency1: overrides.c1 ?? 100,
      competency2: overrides.c2 ?? 100,
      competency3: overrides.c3 ?? 100,
      competency4: overrides.c4 ?? 100,
      competency5: overrides.c5 ?? 100,
      ...(overrides.createdAt ? { createdAt: overrides.createdAt } : {}),
    },
  });
}

function makeRequest(
  usernameParam: string,
  requester: Requester,
): AuthenticatedRequest<void, ListUserEssaysStatisticsParam> {
  return {
    body: undefined,
    params: { username: usernameParam },
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

describe('ListUserEssaysStatisticsController (integration)', () => {
  describe('GET /api/essays/:username/statistics — success cases', () => {
    it("should return the requester's own empty statistics when using 'me' and there are no essays", async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const controller = makeSut();

      const response = await controller.handle(makeRequest('me', student));

      expect(response.statusCode).toBe(200);
      const body = response.body as UserEssaysOverviewDto;
      expect(body.essays).toHaveLength(0);
      expect(body.statistics).toEqual({
        totalCount: 0,
        globalAverage: 0,
        averagesPerCompetency: { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 },
      });
    });

    it("should return the requester's own essays when using 'me'", async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createEssay(student.id, { theme: 'Redação 1' });
      const controller = makeSut();

      const response = await controller.handle(makeRequest('me', student));

      expect(response.statusCode).toBe(200);
      const body = response.body as UserEssaysOverviewDto;
      expect(body.essays).toHaveLength(1);
      expect(body.essays[0]).toMatchObject({
        authorId: student.id,
        theme: 'Redação 1',
      });
      expect(body.statistics.totalCount).toBe(1);
    });

    it('should allow a user to view their own essays by passing their own username directly', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createEssay(student.id);
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest(TEST_STUDENT_USERNAME, student),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as UserEssaysOverviewDto;
      expect(body.statistics.totalCount).toBe(1);
    });

    it('should return the correct shape for each essay in the list', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createEssay(student.id, {
        theme: 'Redação Teste',
        c1: 120,
        c2: 100,
        c3: 80,
        c4: 160,
        c5: 140,
      });
      const controller = makeSut();

      const response = await controller.handle(makeRequest('me', student));

      expect(response.statusCode).toBe(200);
      const body = response.body as UserEssaysOverviewDto;
      const essay = body.essays[0];
      expect(essay).toHaveProperty('id');
      expect(essay).toHaveProperty('authorId', student.id);
      expect(essay).toHaveProperty('theme', 'Redação Teste');
      expect(essay).toHaveProperty('createdAt');
      expect(essay.grades).toMatchObject({
        c1: 120,
        c2: 100,
        c3: 80,
        c4: 160,
        c5: 140,
        total: 600,
      });
    });

    it('should calculate globalAverage and averagesPerCompetency correctly across multiple essays', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      // total = 600
      await createEssay(student.id, {
        c1: 120,
        c2: 120,
        c3: 120,
        c4: 120,
        c5: 120,
      });
      // total = 1000
      await createEssay(student.id, {
        c1: 200,
        c2: 200,
        c3: 200,
        c4: 200,
        c5: 200,
      });
      const controller = makeSut();

      const response = await controller.handle(makeRequest('me', student));

      expect(response.statusCode).toBe(200);
      const body = response.body as UserEssaysOverviewDto;
      expect(body.statistics.totalCount).toBe(2);
      // global average = (600 + 1000) / 2 = 800
      expect(body.statistics.globalAverage).toBe(800);
      // per-competency average = (120 + 200) / 2 = 160 for every competency
      expect(body.statistics.averagesPerCompetency).toEqual({
        c1: 160,
        c2: 160,
        c3: 160,
        c4: 160,
        c5: 160,
      });
    });

    it('should return essays ordered by createdAt in descending order', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const older = await createEssay(student.id, {
        theme: 'Redação Antiga',
        createdAt: new Date('2024-01-01T00:00:00Z'),
      });
      const newer = await createEssay(student.id, {
        theme: 'Redação Recente',
        createdAt: new Date('2024-06-01T00:00:00Z'),
      });
      const controller = makeSut();

      const response = await controller.handle(makeRequest('me', student));

      expect(response.statusCode).toBe(200);
      const body = response.body as UserEssaysOverviewDto;
      expect(body.essays).toHaveLength(2);
      expect(body.essays[0].id).toBe(newer.id);
      expect(body.essays[1].id).toBe(older.id);
    });

    it("should allow an ADMIN to view any user's essays by username", async () => {
      const admin = await createUser({
        name: 'Admin Teste',
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createEssay(student.id);
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest(TEST_STUDENT_USERNAME, admin),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as UserEssaysOverviewDto;
      expect(body.statistics.totalCount).toBe(1);
      expect(body.essays[0].authorId).toBe(student.id);
    });

    it('should allow a TEACHER to view the essays of a student assigned to them', async () => {
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
      await createEssay(student.id);
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest(TEST_STUDENT_USERNAME, teacher),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as UserEssaysOverviewDto;
      expect(body.statistics.totalCount).toBe(1);
    });

    it("should allow an ADMIN to view a TEACHER's essays", async () => {
      const admin = await createUser({
        name: 'Admin Teste',
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });
      const teacher = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      await createEssay(teacher.id);
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest(TEST_TEACHER_USERNAME, admin),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as UserEssaysOverviewDto;
      expect(body.statistics.totalCount).toBe(1);
    });
  });

  describe('GET /api/essays/:username/statistics — error cases', () => {
    it('should return 400 when the username has an invalid format', async () => {
      const admin = await createUser({
        name: 'Admin Teste',
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });
      const controller = makeSut();

      const response = await controller.handle(makeRequest('-invalido', admin));

      expect(response.statusCode).toBe(400);
    });

    it('should return 404 when the target username does not exist', async () => {
      const admin = await createUser({
        name: 'Admin Teste',
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest('usuario.nao.existe', admin),
      );

      expect(response.statusCode).toBe(404);
    });

    it('should return 403 when a TEACHER tries to view a student that is not assigned to them', async () => {
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
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest(TEST_STUDENT_USERNAME, teacher),
      );

      expect(response.statusCode).toBe(403);
    });
  });
});
