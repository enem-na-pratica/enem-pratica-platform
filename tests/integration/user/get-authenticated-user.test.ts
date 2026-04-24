import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { UserDto } from '@/src/core/application/common/dtos';
import { ROLES } from '@/src/core/domain/auth/roles.constants';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeGetAuthenticatedUser } from '@/src/core/main/factories/user/make-get-authenticated-user.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const TEST_PASSWORD = 'Senha@123';
const TEST_USERNAME = 'auth.user.teste';

function makeSut() {
  return makeGetAuthenticatedUser();
}

function makeRequest(requesterId: {
  id: string;
  username: string;
  role: (typeof ROLES)[keyof typeof ROLES];
}): AuthenticatedRequest<void> {
  return {
    body: undefined as void,
    requester: requesterId,
  };
}

describe('GetAuthenticatedUserController (integration)', () => {
  describe('GET /api/users/me — success cases', () => {
    it('should return 200 and the UserDto of the authenticated user', async () => {
    });
  });
});
