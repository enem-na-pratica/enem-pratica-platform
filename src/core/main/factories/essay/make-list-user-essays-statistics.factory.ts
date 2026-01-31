import { ListUserEssaysStatisticsController } from "@/src/core/presentation/controllers/essay";
import { ListUserEssaysStatisticsUseCase } from "@/src/core/application/use-cases/essay";
import {
  makePrismaStudentTeacherRepository,
  makePrismaUserRepository
} from "@/src/core/main/factories/common/repositories";
import { PrismaListEssaysByAuthorQuery } from "@/src/core/infrastructure/databases/prisma/queries";
import {
  ZodValidator,
  usernameSchema
} from "@/src/core/infrastructure/validation/zod";
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makePrismaEssayDtoMapper } from '@/src/core/main/factories/common/mappers';

export function makeListUserEssaysStatistics() {
  const prismaListEssaysByAuthorQuery = new PrismaListEssaysByAuthorQuery({
    prisma,
    mapper: makePrismaEssayDtoMapper(),
  });
  const listUserEssaysStatisticsUseCase = new ListUserEssaysStatisticsUseCase({
    listEssaysByAuthorQuery: prismaListEssaysByAuthorQuery,
    studentTeacherRepository: makePrismaStudentTeacherRepository(),
    userRepository: makePrismaUserRepository(),
  });

  const zodValidator = new ZodValidator(usernameSchema);

  return new ListUserEssaysStatisticsController({
    listUserEssaysStatisticsUseCase,
    validator: zodValidator,
  });
}