import { PrismaEssayRepository } from '@/src/core/infrastructure/databases/prisma/repositories';
import { EssayEntityMapper } from '@/src/core/infrastructure/databases/prisma/mappers';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma'

export function makePrismaEssayRepository() {
  const essayEntityMapper = new EssayEntityMapper();
  return new PrismaEssayRepository({
    prisma,
    mapper: essayEntityMapper
  });
}