import { ListEssaysUseCase } from '@/src/core/application/use-cases/essay';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaListEssaysQuery } from '@/src/core/infrastructure/databases/prisma/queries';
import {
  ZodValidator,
  listEssaysQuerySchema,
  usernameSchema,
} from '@/src/core/infrastructure/validation/zod';
import { makePrismaEssayPaginatedSliceMapper } from '@/src/core/main/factories/common/mappers';
import { makeUserAccessService } from '@/src/core/main/factories/common/services';
import { ListEssaysController } from '@/src/core/presentation/controllers/essay';

export function makeListEssays() {
  const prismaListEssaysQuery = new PrismaListEssaysQuery({
    prisma,
    mapper: makePrismaEssayPaginatedSliceMapper(),
  });

  const listEssaysUseCase = new ListEssaysUseCase({
    listEssaysQuery: prismaListEssaysQuery,
    userAccessService: makeUserAccessService(),
  });

  const usernameValidator = new ZodValidator(usernameSchema);
  const listEssaysQueryValidator = new ZodValidator(listEssaysQuerySchema);

  return new ListEssaysController({
    listEssaysUseCase,
    usernameValidator,
    listEssaysQueryValidator,
  });
}
