import { ListUserMockExamsStatisticsUseCase } from '@/src/core/application/use-cases/mock-exam';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaListMockExamsByAuthorQuery } from '@/src/core/infrastructure/databases/prisma/queries';
import {
  ZodValidator,
  usernameSchema,
} from '@/src/core/infrastructure/validation/zod';
import { makePrismaMockExamDtoMapper } from '@/src/core/main/factories/common/mappers';
import { makeUserAccessService } from '@/src/core/main/factories/common/services';
import { ListUserMockExamsStatisticsController } from '@/src/core/presentation/controllers/mock-exam';

export function makeListUserMockExamsStatistics() {
  const prismaListMockExamsByAuthorQuery = new PrismaListMockExamsByAuthorQuery(
    {
      prisma,
      mapper: makePrismaMockExamDtoMapper(),
    },
  );

  const listUserMockExamsStatisticsUseCase =
    new ListUserMockExamsStatisticsUseCase({
      listMockExamsByAuthorQuery: prismaListMockExamsByAuthorQuery,
      userAccessService: makeUserAccessService(),
    });

  const validator = new ZodValidator(usernameSchema);

  return new ListUserMockExamsStatisticsController({
    listUserMockExamsStatisticsUseCase,
    validator,
  });
}
