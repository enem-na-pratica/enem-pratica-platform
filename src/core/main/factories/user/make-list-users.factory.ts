import { ListUsersUseCase } from '@/src/core/application/use-cases/user';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaListUsersQuery } from '@/src/core/infrastructure/databases/prisma/queries';
import { makePrismaUserDtoMapper } from '@/src/core/main/factories/common/mappers';
import { ListUsersController } from '@/src/core/presentation/controllers/user';

export function makeListUsers() {
  const prismaListUsersQuery = new PrismaListUsersQuery({
    mapper: makePrismaUserDtoMapper(),
    prisma,
  });
  const listUsersUseCase = new ListUsersUseCase({
    listUsers: prismaListUsersQuery,
  });

  return new ListUsersController({
    listUsersUseCase,
  });
}
