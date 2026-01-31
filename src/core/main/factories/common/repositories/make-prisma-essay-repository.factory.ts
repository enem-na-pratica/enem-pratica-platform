import { PrismaEssayRepository } from '@/src/core/infrastructure/databases/prisma/repositories';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeEssayEntityMapper } from '@/src/core/main/factories/common/mappers';

export function makePrismaEssayRepository() {
  return new PrismaEssayRepository({
    prisma,
    mapper: makeEssayEntityMapper(),
  });
}