import { PrismaQuestionSessionRepository } from '@/src/core/infrastructure/databases/prisma/repositories';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeQuestionSessionEntityMapper } from '@/src/core/main/factories/common/mappers';

export function makePrismaQuestionSessionRepository() {
  return new PrismaQuestionSessionRepository({
    prisma,
    mapper: makeQuestionSessionEntityMapper(),
  });
}
