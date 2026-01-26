import { ListUserEssaysSummaryController } from "@/src/core/presentation/controllers/essay";
import { ListUserEssaysSummaryUseCase } from "@/src/core/application/use-cases/essay";
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

export function makeListUserEssaysSummaryController() {
  const prismaListEssaysByAuthorQuery = new PrismaListEssaysByAuthorQuery({
    prisma,
    mapper: makePrismaEssayDtoMapper(),
  });
  const listUserEssaysSummaryUseCase = new ListUserEssaysSummaryUseCase({
    listEssaysByAuthorQuery: prismaListEssaysByAuthorQuery,
    studentTeacherRepository: makePrismaStudentTeacherRepository(),
    userRepository: makePrismaUserRepository(),
  });

  const zodValidator = new ZodValidator(usernameSchema);

  return new ListUserEssaysSummaryController({
    listUserEssaysSummaryUseCase,
    validator: zodValidator,
  });
}