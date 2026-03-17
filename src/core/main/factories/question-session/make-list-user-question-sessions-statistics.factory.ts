import { ListUserQuestionSessionsStatisticsUseCase } from '@/src/core/application/use-cases/question-session/list-user-question-session-statistics';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaListQuestionSessionsByAuthorQuery } from '@/src/core/infrastructure/databases/prisma/queries';
import {
  ZodValidator,
  usernameSchema,
} from '@/src/core/infrastructure/validation/zod';
import { makePrismaQuestionSessionWithTopicAndSubjectDtoMapper } from '@/src/core/main/factories/common/mappers';
import { makeUserAccessService } from '@/src/core/main/factories/common/services';
import { ListUserQuestionSessionsStatisticsController } from '@/src/core/presentation/controllers/question-session';

export function makeListUserQuestionSessionsStatistics() {
  const prismaListQuestionSessionsByAuthorQuery =
    new PrismaListQuestionSessionsByAuthorQuery({
      prisma,
      mapper: makePrismaQuestionSessionWithTopicAndSubjectDtoMapper(),
    });

  const listUserQuestionSessionsStatisticsUseCase =
    new ListUserQuestionSessionsStatisticsUseCase({
      listQuestionSessionsByAuthorQuery:
        prismaListQuestionSessionsByAuthorQuery,
      userAccessService: makeUserAccessService(),
    });

  const validator = new ZodValidator(usernameSchema);

  return new ListUserQuestionSessionsStatisticsController({
    listUserQuestionSessionsStatisticsUseCase,
    validator,
  });
}
