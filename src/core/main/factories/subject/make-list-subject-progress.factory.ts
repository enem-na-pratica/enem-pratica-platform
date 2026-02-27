import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaListSubjectProgressByTargetUserQuery } from '@/src/core/infrastructure/databases/prisma/queries';
import { makePrismaTopicProgressDtoMapper } from '@/src/core/main/factories/common/mappers/db-to-dto';

export function makeListSubjectProgress() {
  const listSubjectProgressByTargetUserQuery =
    new PrismaListSubjectProgressByTargetUserQuery({
      prisma,
      mapper: makePrismaTopicProgressDtoMapper(),
    });

  throw new Error('Not implemented yet');
}
