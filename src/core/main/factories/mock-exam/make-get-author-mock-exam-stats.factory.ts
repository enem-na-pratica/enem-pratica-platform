import { GetAuthorMockExamStatsUseCase } from '@/src/core/application/use-cases/mock-exam';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaGetMockExamsRawAggregateQuery } from '@/src/core/infrastructure/databases/prisma/queries';
import {
  ZodValidator,
  usernameSchema,
} from '@/src/core/infrastructure/validation/zod';
import { makePrismaMockExamsRawAggregateMapper } from '@/src/core/main/factories/common/mappers';
import { makeUserAccessService } from '@/src/core/main/factories/common/services';
import { GetAuthorMockExamStatsController } from '@/src/core/presentation/controllers/mock-exam';

export function makeGetAuthorMockExamStats() {
  const prismaGetMockExamsRawAggregateQuery =
    new PrismaGetMockExamsRawAggregateQuery({
      prisma,
      mapper: makePrismaMockExamsRawAggregateMapper(),
    });

  const getAuthorMockExamStatsUseCase = new GetAuthorMockExamStatsUseCase({
    userAccessService: makeUserAccessService(),
    getMockExamsRawAggregateQuery: prismaGetMockExamsRawAggregateQuery,
  });

  const usernameValidator = new ZodValidator(usernameSchema);

  return new GetAuthorMockExamStatsController({
    getAuthorMockExamStatsUseCase: getAuthorMockExamStatsUseCase,
    validator: usernameValidator,
  });
}
