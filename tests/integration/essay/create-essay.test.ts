import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makeCreateEssay } from '@/src/core/main/factories/essay/make-create-essay.factory';
import type {
  AuthenticatedRequest,
  ErrorResponse,
} from '@/src/core/presentation/protocols';

const TEST_PASSWORD = 'Senha@123';

const TEST_STUDENT_USERNAME = 'student.essay.teste';
const TEST_STUDENT2_USERNAME = 'student2.essay.teste';
const TEST_TEACHER_USERNAME = 'teacher.essay.teste';
const TEST_ADMIN_USERNAME = 'admin.essay.teste';

const ALL_TEST_USERNAMES = [
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
  TEST_TEACHER_USERNAME,
  TEST_ADMIN_USERNAME,
];

const VALID_GRADES = {
  c1: 120,
  c2: 160,
  c3: 200,
  c4: 80,
  c5: 40,
} as const;

const VALID_GRADES_TOTAL = Object.values(VALID_GRADES).reduce(
  (acc, val) => acc + val,
  0,
);

type EssayBody = {
  theme: string;
  grades: { c1: number; c2: number; c3: number; c4: number; c5: number };
};

type Requester = { id: string; username: string; role: Role };

type EssayDtoLike = {
  id: string;
  authorId: string;
  theme: string;
  grades: {
    c1: number;
    c2: number;
    c3: number;
    c4: number;
    c5: number;
    total: number;
  };
  createdAt: string;
};

function makeSut() {
  return makeCreateEssay();
}

async function createUser(data: {
  name: string;
  username: string;
  role: Role;
}): Promise<Requester> {
  const bcrypt = makeBcryptAdapter();
  const passwordHash = await bcrypt.hash(TEST_PASSWORD);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      passwordHash,
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

function makeRequest({
  body,
  username,
  requester,
}: {
  body: Partial<EssayBody>;
  username: string;
  requester: Requester;
}): AuthenticatedRequest<EssayBody, { username: string }> {
  return {
    body: body as EssayBody,
    params: { username },
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

describe('CreateEssayController (integration)', () => {
  describe('POST /api/essays/users/:username — success cases', () => {
    it('should return 201 and create an essay for the requester itself using "me"', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const { controller } = { controller: makeSut() };

      const response = await controller.handle(
        makeRequest({
          body: { theme: 'o brasil na era digital', grades: VALID_GRADES },
          username: 'me',
          requester: student,
        }),
      );

      expect(response.statusCode).toBe(201);

      const body = response.body as EssayDtoLike;
      expect(body.authorId).toBe(student.id);
      expect(body.theme).toBe('O Brasil na Era Digital');
      expect(body.grades.total).toBe(VALID_GRADES_TOTAL);
    });

    it('should return 201 when the username param matches the requester own username', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          body: {
            theme: 'meio ambiente e sustentabilidade',
            grades: VALID_GRADES,
          },
          username: TEST_STUDENT_USERNAME,
          requester: student,
        }),
      );

      expect(response.statusCode).toBe(201);
      const body = response.body as EssayDtoLike;
      expect(body.authorId).toBe(student.id);
    });

    it('should allow a TEACHER to create an essay for a student explicitly assigned to them', async () => {
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

      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          body: {
            theme: 'educação no seculo vinte e um',
            grades: VALID_GRADES,
          },
          username: TEST_STUDENT_USERNAME,
          requester: teacher,
        }),
      );

      expect(response.statusCode).toBe(201);
      const body = response.body as EssayDtoLike;
      expect(body.authorId).toBe(student.id);
    });

    it('should allow an ADMIN to create an essay for any user, regardless of assignment', async () => {
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

      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          body: {
            theme: 'desafios da inteligencia artificial',
            grades: VALID_GRADES,
          },
          username: TEST_STUDENT_USERNAME,
          requester: admin,
        }),
      );

      expect(response.statusCode).toBe(201);
      const body = response.body as EssayDtoLike;
      expect(body.authorId).toBe(student.id);
    });

    it('should persist the essay in the database with the correct data', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          body: {
            theme: 'valorização do trabalho no brasil',
            grades: VALID_GRADES,
          },
          username: 'me',
          requester: student,
        }),
      );

      const body = response.body as EssayDtoLike;

      const persisted = await prisma.essay.findUnique({
        where: { id: body.id },
      });

      expect(persisted).not.toBeNull();
      expect(persisted?.authorId).toBe(student.id);
      expect(persisted?.competency1).toBe(VALID_GRADES.c1);
      expect(persisted?.competency2).toBe(VALID_GRADES.c2);
      expect(persisted?.competency3).toBe(VALID_GRADES.c3);
      expect(persisted?.competency4).toBe(VALID_GRADES.c4);
      expect(persisted?.competency5).toBe(VALID_GRADES.c5);
    });

    it('should return the total score as the sum of the five competencies', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          body: {
            theme: 'a importância da leitura hoje',
            grades: VALID_GRADES,
          },
          username: 'me',
          requester: student,
        }),
      );

      const body = response.body as EssayDtoLike;
      expect(body.grades.total).toBe(
        VALID_GRADES.c1 +
          VALID_GRADES.c2 +
          VALID_GRADES.c3 +
          VALID_GRADES.c4 +
          VALID_GRADES.c5,
      );
    });

    it('should apply PT-BR title case capitalization to the theme', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          body: {
            theme: 'o impacto das redes sociais para os jovens',
            grades: VALID_GRADES,
          },
          username: 'me',
          requester: student,
        }),
      );

      const body = response.body as EssayDtoLike;
      expect(body.theme).toBe('O Impacto das Redes Sociais para os Jovens');
    });
  });

  describe('POST /api/essays/users/:username — error cases', () => {
    it('should return 403 when a STUDENT tries to create an essay for another user', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await createUser({
        name: 'Aluno Teste Dois',
        username: TEST_STUDENT2_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          body: { theme: 'tentativa de acesso indevido', grades: VALID_GRADES },
          username: TEST_STUDENT2_USERNAME,
          requester: student,
        }),
      );

      expect(response.statusCode).toBe(403);
    });
  });

  it('should return 403 when a TEACHER tries to create an essay for a student not assigned to them', async () => {
    const teacher = await createUser({
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

    const response = await controller.handle(
      makeRequest({
        body: { theme: 'tentativa de acesso indevido', grades: VALID_GRADES },
        username: TEST_STUDENT_USERNAME,
        requester: teacher,
      }),
    );

    expect(response.statusCode).toBe(403);
  });

  it('should return 403 when a TEACHER tries to create an essay for an ADMIN', async () => {
    const teacher = await createUser({
      name: 'Professor Teste',
      username: TEST_TEACHER_USERNAME,
      role: ROLES.TEACHER,
    });
    await createUser({
      name: 'Admin Teste',
      username: TEST_ADMIN_USERNAME,
      role: ROLES.ADMIN,
    });

    const controller = makeSut();

    const response = await controller.handle(
      makeRequest({
        body: { theme: 'tentativa de acesso indevido', grades: VALID_GRADES },
        username: TEST_ADMIN_USERNAME,
        requester: teacher,
      }),
    );

    expect(response.statusCode).toBe(403);
  });

  it('should return 404 when the target username does not exist', async () => {
    const teacher = await createUser({
      name: 'Professor Teste',
      username: TEST_TEACHER_USERNAME,
      role: ROLES.TEACHER,
    });

    const controller = makeSut();

    const response = await controller.handle(
      makeRequest({
        body: { theme: 'usuário alvo inexistente', grades: VALID_GRADES },
        username: 'usuario.nao.existe.teste',
        requester: teacher,
      }),
    );

    expect(response.statusCode).toBe(404);
  });

  it('should return 400 when the theme is missing', async () => {
    const student = await createUser({
      name: 'Aluno Teste',
      username: TEST_STUDENT_USERNAME,
      role: ROLES.STUDENT,
    });

    const controller = makeSut();

    const response = await controller.handle(
      makeRequest({
        body: { grades: VALID_GRADES } as Partial<EssayBody>,
        username: 'me',
        requester: student,
      }),
    );

    expect(response.statusCode).toBe(400);
    const body = response.body as ErrorResponse;
    expect(body.message).toBeTruthy();
  });
});
