import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { EssayPaginatedResponse } from '@/src/core/application/use-cases/essay/list-essays';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makeListEssays } from '@/src/core/main/factories/essay/make-list-essays.factory';
import type {
  AuthenticatedRequest,
  ErrorResponse,
} from '@/src/core/presentation/protocols';

const TEST_PASSWORD = 'Senha@123';
let cachedPasswordHash: string;

const TEST_STUDENT_USERNAME = 'student.essays.teste';
const TEST_STUDENT2_USERNAME = 'student2.essays.teste';
const TEST_TEACHER_USERNAME = 'teacher.essays.teste';
const TEST_ADMIN_USERNAME = 'admin.essays.teste';

const ALL_TEST_USERNAMES = [
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
  TEST_TEACHER_USERNAME,
  TEST_ADMIN_USERNAME,
];

type TestRequester = { id: string; username: string; role: Role };

type ValidationErrorBody = ErrorResponse<Record<string, string[]>>;

function makeSut() {
  return makeListEssays();
}

async function createUser(data: {
  name: string;
  username: string;
  role: Role;
}): Promise<TestRequester> {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      passwordHash: cachedPasswordHash,
      role: data.role,
    },
  });

  return { id: user.id, username: user.username, role: data.role };
}

async function linkStudentToTeacher(
  studentId: string,
  teacherId: string,
): Promise<void> {
  await prisma.studentTeacher.create({ data: { studentId, teacherId } });
}

async function createEssay(
  authorId: string,
  data: {
    theme: string;
    createdAt?: Date;
    grades?: [number, number, number, number, number];
  },
) {
  const [c1, c2, c3, c4, c5] = data.grades ?? [120, 120, 120, 120, 120];

  return prisma.essay.create({
    data: {
      authorId,
      theme: data.theme,
      competency1: c1,
      competency2: c2,
      competency3: c3,
      competency4: c4,
      competency5: c5,
      ...(data.createdAt && { createdAt: data.createdAt }),
    },
  });
}

function makeRequest({
  requester,
  username = 'me',
  query = {},
}: {
  requester: TestRequester;
  username?: string;
  query?: Record<string, string>;
}): AuthenticatedRequest<void, { username: string }, Record<string, string>> {
  return {
    body: undefined,
    params: { username },
    query,
    requester,
  };
}

function localDate(day: number, hour = 12): Date {
  return new Date(2024, 2, day, hour, 0, 0, 0);
}

beforeAll(async () => {
  await prisma.$connect();
  const bcrypt = makeBcryptAdapter();
  cachedPasswordHash = await bcrypt.hash(TEST_PASSWORD);
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

describe('ListEssaysController (integration)', () => {
  describe('GET /api/essays/users/:username — success cases', () => {
    it('should return 200 with empty data and zeroed meta when the user has no essays', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const response = await makeSut().handle(
        makeRequest({ requester: student }),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as EssayPaginatedResponse;
      expect(body.data).toEqual([]);
      expect(body.meta).toEqual({
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it("should return only the requester's own essays mapped to the DTO shape when using 'me'", async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const otherStudent = await createUser({
        name: 'Outro Aluno',
        username: TEST_STUDENT2_USERNAME,
        role: ROLES.STUDENT,
      });

      const essay = await createEssay(student.id, {
        theme: 'Tema Próprio',
        grades: [160, 120, 140, 180, 200],
      });
      await createEssay(otherStudent.id, { theme: 'Tema de Outro Aluno' });

      const response = await makeSut().handle(
        makeRequest({ requester: student }),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as EssayPaginatedResponse;
      expect(body.data).toHaveLength(1);
      expect(body.meta.totalItems).toBe(1);
      expect(body.data[0]).toEqual({
        id: essay.id,
        authorId: student.id,
        theme: 'Tema Próprio',
        grades: { c1: 160, c2: 120, c3: 140, c4: 180, c5: 200, total: 800 },
        createdAt: essay.createdAt.toISOString(),
      });
    });

    it('should sort by createdAt descending by default', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      await createEssay(student.id, {
        theme: 'Mais Antiga',
        createdAt: localDate(1),
      });
      await createEssay(student.id, {
        theme: 'Mais Recente',
        createdAt: localDate(3),
      });
      await createEssay(student.id, {
        theme: 'Intermediaria',
        createdAt: localDate(2),
      });

      const response = await makeSut().handle(
        makeRequest({ requester: student }),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as EssayPaginatedResponse;
      expect(body.data.map((e) => e.theme)).toEqual([
        'Mais Recente',
        'Intermediaria',
        'Mais Antiga',
      ]);
    });

    it('should sort by theme ascending when requested', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      await createEssay(student.id, { theme: 'Gamma' });
      await createEssay(student.id, { theme: 'Alpha' });
      await createEssay(student.id, { theme: 'Beta' });

      const response = await makeSut().handle(
        makeRequest({
          requester: student,
          query: { sortBy: 'theme', sortOrder: 'asc' },
        }),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as EssayPaginatedResponse;
      expect(body.data.map((e) => e.theme)).toEqual(['Alpha', 'Beta', 'Gamma']);
    });

    it('should paginate results and compute meta correctly across pages', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      for (let day = 1; day <= 5; day++) {
        await createEssay(student.id, {
          theme: `Tema ${day}`,
          createdAt: localDate(day),
        });
      }

      const sut = makeSut();

      const middlePage = await sut.handle(
        makeRequest({ requester: student, query: { page: '2', limit: '2' } }),
      );
      const lastPage = await sut.handle(
        makeRequest({ requester: student, query: { page: '3', limit: '2' } }),
      );

      expect(middlePage.statusCode).toBe(200);
      const middleBody = middlePage.body as EssayPaginatedResponse;
      expect(middleBody.data.map((e) => e.theme)).toEqual(['Tema 3', 'Tema 2']);
      expect(middleBody.meta).toEqual({
        page: 2,
        limit: 2,
        totalItems: 5,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });

      expect(lastPage.statusCode).toBe(200);
      const lastBody = lastPage.body as EssayPaginatedResponse;
      expect(lastBody.data.map((e) => e.theme)).toEqual(['Tema 1']);
      expect(lastBody.meta.hasNextPage).toBe(false);
      expect(lastBody.meta.hasPreviousPage).toBe(true);
    });

    it('should filter by theme using a case-insensitive partial match', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      await createEssay(student.id, { theme: 'Desafios da Educação Publica' });
      await createEssay(student.id, { theme: 'Educação Digital' });
      await createEssay(student.id, { theme: 'Meio Ambiente' });

      const response = await makeSut().handle(
        makeRequest({ requester: student, query: { theme: 'educação' } }),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as EssayPaginatedResponse;
      expect(body.meta.totalItems).toBe(2);
      expect(body.data.map((e) => e.theme).sort()).toEqual([
        'Desafios da Educação Publica',
        'Educação Digital',
      ]);
    });

    it('should filter by date range including the whole start and end days', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      await createEssay(student.id, {
        theme: 'Dia 09',
        createdAt: localDate(9),
      });
      await createEssay(student.id, {
        theme: 'Dia 10',
        createdAt: localDate(10),
      });
      await createEssay(student.id, {
        theme: 'Dia 11',
        createdAt: localDate(11),
      });
      await createEssay(student.id, {
        theme: 'Dia 12',
        createdAt: localDate(12),
      });

      // 6:00 PM on the 10th to 6:00 AM on the 11th: the use case should expand to cover the entire day
      const response = await makeSut().handle(
        makeRequest({
          requester: student,
          query: {
            startDate: '2024-03-10T18:00:00',
            endDate: '2024-03-11T06:00:00',
          },
        }),
      );

      expect(response.statusCode).toBe(200);

      const body = response.body as EssayPaginatedResponse;
      expect(body.data.map((e) => e.theme).sort()).toEqual([
        'Dia 10',
        'Dia 11',
      ]);
    });
  });

  describe('GET /api/essays/users/:username — error cases', () => {});
});
