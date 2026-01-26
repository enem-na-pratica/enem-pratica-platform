import { PrismaUserRepository } from '@/src/core/infrastructure/databases/prisma/repositories';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeUserEntityMapper } from '@/src/core/main/factories/common/mappers'

export function makePrismaUserRepository() {
  return new PrismaUserRepository({
    prisma,
    mapper: makeUserEntityMapper(),
  });
}