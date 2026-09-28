import { ListMockExamsByAuthorUseCase } from '@/src/core/application/use-cases/mock-exam';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaListMockExamsByAuthorQuery } from '@/src/core/infrastructure/databases/prisma/queries';
import {
  ZodValidator,
  usernameSchema,
} from '@/src/core/infrastructure/validation/zod';
import { makePrismaMockExamDtoMapper } from '@/src/core/main/factories/common/mappers';
import { makeUserAccessService } from '@/src/core/main/factories/common/services';
import { ListMockExamsByAuthorController } from '@/src/core/presentation/controllers/mock-exam';

export function makeListMockExamsByAuthor() {
  const prismaListMockExamsByAuthorQuery = new PrismaListMockExamsByAuthorQuery(
    {
      prisma,
      mapper: makePrismaMockExamDtoMapper(),
    },
  );

  const listMockExamsByAuthorUseCase = new ListMockExamsByAuthorUseCase({
    listMockExamsByAuthorQuery: prismaListMockExamsByAuthorQuery,
    userAccessService: makeUserAccessService(),
  });

  const validator = new ZodValidator(usernameSchema);

  return new ListMockExamsByAuthorController({
    listMockExamsByAuthorUseCase: listMockExamsByAuthorUseCase,
    validator,
  });
}
