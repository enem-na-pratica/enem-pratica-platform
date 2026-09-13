import { ListAuthorEssaysUseCase } from '@/src/core/application/use-cases/essay';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaListAuthorEssaysQuery } from '@/src/core/infrastructure/databases/prisma/queries';
import {
  ZodValidator,
  usernameSchema,
} from '@/src/core/infrastructure/validation/zod';
import { makePrismaEssayDtoMapper } from '@/src/core/main/factories/common/mappers';
import { makeUserAccessService } from '@/src/core/main/factories/common/services';
import { ListAuthorEssaysController } from '@/src/core/presentation/controllers/essay';

export function makeListAuthorEssays() {
  const prismaListAuthorEssaysQuery = new PrismaListAuthorEssaysQuery({
    prisma,
    mapper: makePrismaEssayDtoMapper(),
  });

  const listAuthorEssaysUseCase = new ListAuthorEssaysUseCase({
    listAuthorEssaysQuery: prismaListAuthorEssaysQuery,
    userAccessService: makeUserAccessService(),
  });

  const usernameValidator = new ZodValidator(usernameSchema);

  return new ListAuthorEssaysController({
    listAuthorEssaysUseCase,
    usernameValidator,
  });
}
