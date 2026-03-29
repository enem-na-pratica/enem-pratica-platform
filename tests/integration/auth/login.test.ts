import { afterAll, afterEach, beforeAll } from 'vitest';

import type { LoginDto } from '@/src/core/application/use-cases/auth/login/login.dto';
import { ROLES } from '@/src/core/domain/auth/roles.constants';
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
