import { PrismaUserRepository } from '@/src/core/infrastructure/databases/prisma/repositories';
import { UserEntityMapper } from '@/src/core/infrastructure/databases/prisma/mappers';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';

export function makePrismaUserRepository() {
  const userEntityMapper = new UserEntityMapper();
  return new PrismaUserRepository({
    prisma,
    mapper: userEntityMapper
  });
}