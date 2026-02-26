import { ListSubjectsUseCase } from '@/src/core/application/use-cases/subject';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaListSubjectsQuery } from '@/src/core/infrastructure/databases/prisma/queries';
import { makePrismaSubjectDtoMapper } from '@/src/core/main/factories/common/mappers/db-to-dto';
import { ListSubjectsController } from '@/src/core/presentation/controllers/subject';

export function makeListSubjects() {
  const listSubjectsQuery = new PrismaListSubjectsQuery({
    mapper: makePrismaSubjectDtoMapper(),
    prisma,
  });

  const listSubjectsUseCase = new ListSubjectsUseCase({
    listSubjectsQuery,
  });

  return new ListSubjectsController({
    listSubjectsUseCase,
  });
}
