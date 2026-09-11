import { GetAuthorEssaysStatsUseCase } from '@/src/core/application/use-cases/essay';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaGetAuthorEssaysStatsQuery } from '@/src/core/infrastructure/databases/prisma/queries';
import {
  ZodValidator,
  usernameSchema,
} from '@/src/core/infrastructure/validation/zod';
import { makePrismaEssayStatsDtoMapper } from '@/src/core/main/factories/common/mappers';
import { makeUserAccessService } from '@/src/core/main/factories/common/services';
import { GetAuthorEssaysStatsController } from '@/src/core/presentation/controllers/essay';

export function makeGetAuthorEssaysStats() {
  const prismaGetAuthorEssaysStatsQuery = new PrismaGetAuthorEssaysStatsQuery({
    prisma,
    mapper: makePrismaEssayStatsDtoMapper(),
  });

  const getAuthorEssaysStatsUseCase = new GetAuthorEssaysStatsUseCase({
    userAccessService: makeUserAccessService(),
    getAuthorEssaysStatsQuery: prismaGetAuthorEssaysStatsQuery,
  });

  const usernameValidator = new ZodValidator(usernameSchema);

  return new GetAuthorEssaysStatsController({
    getAuthorEssaysStatsUseCase: getAuthorEssaysStatsUseCase,
    validator: usernameValidator,
  });
}
