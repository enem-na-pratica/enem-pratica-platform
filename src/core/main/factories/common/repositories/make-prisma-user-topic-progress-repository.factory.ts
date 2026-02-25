import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaUserTopicProgressRepository } from '@/src/core/infrastructure/databases/prisma/repositories';
import { makeUserTopicProgressEntityMapper } from '@/src/core/main/factories/common/mappers';

export function makePrismaUserTopicProgressRepository() {
  return new PrismaUserTopicProgressRepository({
    prisma,
    mapper: makeUserTopicProgressEntityMapper(),
  });
}
