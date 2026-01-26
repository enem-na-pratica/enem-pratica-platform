import { ListUsersByRolesController } from "@/src/core/presentation/controllers/user";
import { ListUsersByRolesUseCase } from "@/src/core/application/use-cases/user";
import { PrismaListUsersByRolesQuery } from "@/src/core/infrastructure/databases/prisma/queries";
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makePrismaUserDtoMapper } from '@/src/core/main/factories/common/mappers';

export function makeListUsersByRolesController() {
  const prismaListUsersByRolesQuery = new PrismaListUsersByRolesQuery({
    mapper: makePrismaUserDtoMapper(),
    prisma,
  });
  const listUsersByRolesUseCase = new ListUsersByRolesUseCase({
    listUsersByRoles: prismaListUsersByRolesQuery
  });

  return new ListUsersByRolesController({
    listUsersByRolesUseCase
  });
}