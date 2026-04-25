import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { UserDto } from '@/src/core/application/common/dtos';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makeListUsers } from '@/src/core/main/factories/user/make-list-users.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const TEST_PASSWORD = 'Senha@123';

const USERNAMES = {
  teacher: 'teacher.list.teste',
  student: 'student.list.teste',
  admin: 'admin.list.teste',
};

function makeSut() {
  return makeListUsers();
}

function makeRequest(role: Role): AuthenticatedRequest<void> {
  return {
    body: undefined as void,
    requester: { id: 'any-id', username: 'any-user', role: role },
  };
}

describe('ListUsersController (integration)', () => {
  describe('GET /api/users — success cases', () => {
    it('should return 200 with an array when called by an ADMIN', async () => {
      const controller = makeSut();
      const response = await controller.handle(makeRequest(ROLES.ADMIN));

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 200 with an array when called by a SUPER_ADMIN', async () => {
      const controller = makeSut();
      const response = await controller.handle(makeRequest(ROLES.SUPER_ADMIN));

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
