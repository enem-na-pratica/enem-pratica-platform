import { ListAvailableInstructorsController } from "@/src/core/presentation/controllers/user";
import { ListAvailableInstructorsUseCase } from "@/src/core/application/use-cases/user";
import { PrismaListInstructorsLoadQuery } from "@/src/core/infrastructure/databases/prisma/queries";
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makePrismaUserDtoMapper } from '@/src/core/main/factories/common/mappers';

export function makeListAvailableInstructors() {
  const prismaListInstructorsLoadQuery = new PrismaListInstructorsLoadQuery({
    mapper: makePrismaUserDtoMapper(),
    prisma,
  });
  const listAvailableInstructorsUseCase = new ListAvailableInstructorsUseCase({
    listInstructorsLoad: prismaListInstructorsLoadQuery
  });

  return new ListAvailableInstructorsController({
    listAvailableInstructorsUseCase
  });
}