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

async function createTestUser(
  overrides: { username?: string; role?: keyof typeof ROLES } = {},
) {
  const { makeBcryptAdapter } =
    await import('@/src/core/main/factories/common/crypto');
  const bcrypt = makeBcryptAdapter();
  const passwordHash = await bcrypt.hash(TEST_PASSWORD);

  return prisma.user.create({
    data: {
      name: 'Auth User Teste',
      username: overrides.username ?? TEST_USERNAME,
      passwordHash,
      role: overrides.role ?? ROLES.STUDENT,
    },
  });
}

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  await prisma.user.deleteMany({
    where: { username: { in: [TEST_USERNAME, 'outro.user.teste'] } },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GetAuthenticatedUserController (integration)', () => {
  describe('GET /api/users/me — success cases', () => {
    it('should return 200 and the UserDto of the authenticated user', async () => {
      const user = await createTestUser();
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          id: user.id,
          username: user.username,
          role: ROLES.STUDENT,
        }),
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject<Partial<UserDto>>({
        id: user.id,
        name: 'Auth User Teste',
        username: TEST_USERNAME,
        role: ROLES.STUDENT,
      });
    });

    it('should return createdAt and updatedAt as ISO strings', async () => {
      const user = await createTestUser();
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          id: user.id,
          username: user.username,
          role: ROLES.STUDENT,
        }),
      );

      const body = response.body as UserDto;
      expect(response.statusCode).toBe(200);
      expect(body.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(body.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should not expose passwordHash in the response', async () => {
      const user = await createTestUser();
      const controller = makeSut();

      const response = await controller.handle(
        makeRequest({
          id: user.id,
          username: user.username,
          role: ROLES.STUDENT,
        }),
      );

      expect(response.body).not.toHaveProperty('passwordHash');
      expect(response.body).not.toHaveProperty('password');
    });
  });
});
