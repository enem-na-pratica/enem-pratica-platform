import { PrismaMockExamRepository } from '@/src/core/infrastructure/databases/prisma/repositories';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeMockExamEntityMapper } from '@/src/core/main/factories/common/mappers';

export function makePrismaMockExamRepository() {
  return new PrismaMockExamRepository({
    prisma,
    mapper: makeMockExamEntityMapper(),
  });
}