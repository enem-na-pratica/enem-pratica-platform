import { ListSubjectProgressUseCase } from '@/src/core/application/use-cases/subject';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaListSubjectProgressByTargetUserQuery } from '@/src/core/infrastructure/databases/prisma/queries';
import {
  ZodValidator,
  usernameSchema,
} from '@/src/core/infrastructure/validation/zod';
import { makePrismaTopicProgressDtoMapper } from '@/src/core/main/factories/common/mappers/db-to-dto';
import { makeUserAccessService } from '@/src/core/main/factories/common/services';
import { ListSubjectProgressController } from '@/src/core/presentation/controllers/subject';

export function makeListSubjectProgress() {
  const listSubjectProgressByTargetUserQuery =
    new PrismaListSubjectProgressByTargetUserQuery({
      prisma,
      mapper: makePrismaTopicProgressDtoMapper(),
    });

  const listSubjectProgressUseCase = new ListSubjectProgressUseCase({
    userAccessService: makeUserAccessService(),
    listSubjectProgressByTargetUserQuery,
  });

  const zodValidator = new ZodValidator(usernameSchema);

  return new ListSubjectProgressController({
    validator: zodValidator,
    listSubjectProgressUseCase,
  });
}
