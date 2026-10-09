import { GetQuestionSessionStatsByAuthorUseCase } from '@/src/core/application/use-cases/question-session';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaGetQuestionSessionRawAggregateQuery } from '@/src/core/infrastructure/databases/prisma/queries';
import {
  ZodValidator,
  usernameSchema,
} from '@/src/core/infrastructure/validation/zod';
import { makePrismaQuestionSessionStatsRawMapper } from '@/src/core/main/factories/common/mappers';
import { makeUserAccessService } from '@/src/core/main/factories/common/services';
import { GetQuestionSessionStatsByAuthorController } from '@/src/core/presentation/controllers/question-session';

export function makeGetQuestionSessionStatsByAuthor() {
  const prismaGetQuestionSessionRawAggregateQuery =
    new PrismaGetQuestionSessionRawAggregateQuery({
      prisma,
      mapper: makePrismaQuestionSessionStatsRawMapper(),
    });

  const getQuestionSessionStatsByAuthorUseCase =
    new GetQuestionSessionStatsByAuthorUseCase({
      getQuestionSessionRawAggregateQuery:
        prismaGetQuestionSessionRawAggregateQuery,
      userAccessService: makeUserAccessService(),
    });

  const validator = new ZodValidator(usernameSchema);

  return new GetQuestionSessionStatsByAuthorController({
    getQuestionSessionStatsByAuthorUseCase,
    validator,
  });
}
