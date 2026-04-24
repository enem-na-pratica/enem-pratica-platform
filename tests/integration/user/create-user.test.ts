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
  });
});
