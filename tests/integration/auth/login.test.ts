import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { LoginDto } from '@/src/core/application/use-cases/auth/login/login.dto';
import { ROLES } from '@/src/core/domain/auth/roles.constants';
import { JwtAdapter } from '@/src/core/infrastructure/auth/jwt.adapter';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeLogin } from '@/src/core/main/factories/auth';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import type { HttpRequest } from '@/src/core/presentation/protocols';

const TEST_PASSWORD = 'Senha@123';
const TEST_USERNAME = 'joao.teste';

function makeSut() {
  const bcrypt = makeBcryptAdapter();
  const controller = makeLogin();
  return { controller, bcrypt };
}

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  await prisma.user.deleteMany({ where: { username: TEST_USERNAME } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

async function createTestUser(passwordOverride?: string) {
  const { bcrypt } = makeSut();
  const passwordHash = await bcrypt.hash(passwordOverride ?? TEST_PASSWORD);

  return prisma.user.create({
    data: {
      name: 'João Teste',
      username: TEST_USERNAME,
      passwordHash,
      role: ROLES.STUDENT,
    },
  });
}

function makeRequest(body: Partial<LoginDto>): HttpRequest<LoginDto> {
  return { body: body as LoginDto };
}

describe('LoginController (integration)', () => {
  describe('POST /api/auth/login — success cases', () => {
    it('should return 204 and set the auth_token cookie with valid credentials', async () => {
      await createTestUser();
      const { controller } = makeSut();

      const response = await controller.handle(
        makeRequest({ username: TEST_USERNAME, password: TEST_PASSWORD }),
      );

      expect(response.statusCode).toBe(204);
      expect(response.body).toBeUndefined();

      const authCookie = response.cookies?.find((c) => c.name === 'auth_token');
      expect(authCookie).toBeDefined();
      expect(authCookie?.value).toBeTruthy();
      expect(authCookie?.options.httpOnly).toBe(true);
      expect(authCookie?.options.secure).toBe(false);
    });

    it('the generated token must be a valid JWT with user data', async () => {
      await createTestUser();
      const { controller } = makeSut();
      const jwt = new JwtAdapter({
        secret: process.env.JWT_SECRET!,
        expiresIn: '1d',
      });

      const response = await controller.handle(
        makeRequest({ username: TEST_USERNAME, password: TEST_PASSWORD }),
      );

      const authToken = response.cookies?.find((c) => c.name === 'auth_token');

      expect(authToken?.value).toBeTruthy();

      const payload = jwt.verify(authToken!.value);

      expect(payload.username).toBe(TEST_USERNAME);
      expect(payload.role).toBe(ROLES.STUDENT);
      expect(payload.id).toBeTruthy();
    });
  });

  describe('POST /api/auth/login — error cases', () => {
    it('should return 400 when the body is empty', async () => {
      const { controller } = makeSut();

      const response = await controller.handle(makeRequest({}));

      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when the username is invalid', async () => {
      const { controller } = makeSut();

      const response = await controller.handle(
        makeRequest({ username: '-invalido', password: TEST_PASSWORD }),
      );

      expect(response.statusCode).toBe(400);
    });

    it('should return 404 when the user does not exist', async () => {
      const { controller } = makeSut();

      const response = await controller.handle(
        makeRequest({ username: 'nao.existe', password: TEST_PASSWORD }),
      );

      expect(response.statusCode).toBe(404);
    });

    it('should return 401 when the password is wrong', async () => {
      await createTestUser();
      const { controller } = makeSut();

      const response = await controller.handle(
        makeRequest({ username: TEST_USERNAME, password: 'Senha@Errada1' }),
      );

      expect(response.statusCode).toBe(401);
    });

    it('should return 400 when the password does not meet minimum criteria', async () => {
      const { controller } = makeSut();

      const response = await controller.handle(
        makeRequest({ username: TEST_USERNAME, password: '123' }),
      );

      expect(response.statusCode).toBe(400);
    });
  });
});
