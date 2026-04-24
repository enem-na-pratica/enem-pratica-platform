import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { UserDto } from '@/src/core/application/common/dtos';
import type { CreateUserDto } from '@/src/core/application/use-cases/user';
import { ROLES } from '@/src/core/domain/auth/roles.constants';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeCreateUser } from '@/src/core/main/factories/user/make-create-user.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const TEST_PASSWORD = 'Senha@123';
const TEST_TEACHER_USERNAME = 'teacher.teste';
const TEST_STUDENT_USERNAME = 'student.teste';
const TEST_ADMIN_USERNAME = 'admin.teste';

function makeSut() {
  return makeCreateUser();
}

function makeRequest(
  body: Partial<CreateUserDto>,
  requesterId = { id: 'admin-id', username: 'admin', role: ROLES.ADMIN },
): AuthenticatedRequest<CreateUserDto> {
  return {
    body: body as CreateUserDto,
    requester: requesterId,
  };
}

async function createTeacher(): Promise<string> {
  const { makeBcryptAdapter } =
    await import('@/src/core/main/factories/common/crypto');
  const bcrypt = makeBcryptAdapter();
  const passwordHash = await bcrypt.hash(TEST_PASSWORD);

  const teacher = await prisma.user.create({
    data: {
      name: 'Professor Teste',
      username: TEST_TEACHER_USERNAME,
      passwordHash,
      role: ROLES.TEACHER,
    },
  });

  return teacher.id;
}

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  await prisma.user.deleteMany({
    where: {
      username: {
        in: [TEST_TEACHER_USERNAME, TEST_STUDENT_USERNAME, TEST_ADMIN_USERNAME],
      },
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('CreateUserController (integration)', () => {
  describe('POST /api/users — success cases', () => {
    it('should return 201 and the created user DTO when creating a TEACHER', async () => {
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          name: 'Professor Teste',
          username: TEST_TEACHER_USERNAME,
          password: TEST_PASSWORD,
          role: ROLES.TEACHER,
        }),
      );

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body).not.toHaveProperty('passwordHash');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 201 and the created user DTO when creating an ADMIN', async () => {
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          name: 'Admin Teste',
          username: TEST_ADMIN_USERNAME,
          password: TEST_PASSWORD,
          role: ROLES.ADMIN,
        }),
      );

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });
    });

    it('should return 201 and create a STUDENT linked to an existing teacher', async () => {
      const teacherId = await createTeacher();
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          name: 'Aluno Teste',
          username: TEST_STUDENT_USERNAME,
          password: TEST_PASSWORD,
          role: ROLES.STUDENT,
          teacherId,
        }),
      );

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const mentorship = await prisma.studentTeacher.findFirst({
        where: { teacherId },
      });
      expect(mentorship).not.toBeNull();
      expect(mentorship?.teacherId).toBe(teacherId);
    });
  });
});
