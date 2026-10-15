import { ListQuestionSessionsByAuthorUseCase } from '@/src/core/application/use-cases/question-session';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaListQuestionSessionsByAuthorQuery } from '@/src/core/infrastructure/databases/prisma/queries';
import {
  ZodValidator,
  usernameSchema,
} from '@/src/core/infrastructure/validation/zod';
import { makePrismaQuestionSessionExtendedDtoMapper } from '@/src/core/main/factories/common/mappers';
import { makeUserAccessService } from '@/src/core/main/factories/common/services';
import { ListQuestionSessionsByAuthorController } from '@/src/core/presentation/controllers/question-session';

export function makeListQuestionSessionsByAuthor() {
  const prismaListQuestionSessionsByAuthorQuery =
    new PrismaListQuestionSessionsByAuthorQuery({
      prisma,
      mapper: makePrismaQuestionSessionExtendedDtoMapper(),
    });

  const listQuestionSessionsByAuthorUseCase =
    new ListQuestionSessionsByAuthorUseCase({
      listQuestionSessionsByAuthorQuery:
        prismaListQuestionSessionsByAuthorQuery,
      userAccessService: makeUserAccessService(),
    });

  const validator = new ZodValidator(usernameSchema);

  return new ListQuestionSessionsByAuthorController({
    listQuestionSessionsByAuthorUseCase,
    validator,
  });
}
