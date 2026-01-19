import { CreateEssayUseCase } from "@/src/core/application/use-cases/essay/create-essay.use-case";
import {
  makePrismaEssayRepository,
  makeUserPrismaRepository
} from "@/src/core/main/factories/repositories";
import {
  makePrismaUserQuery
} from "@/src/core/main/factories/queries";
import { EssayResDtoMapper } from "@/src/core/application/mapper/essay-dto.mapper";
import { ZodValidation } from '@/src/core/infrastructure/validation/zod/zod-validation';
import { newEssaySchema } from '@/src/core/infrastructure/validation/zod/schemas';
import { CreateEssayController } from "@/src/core/presentation/controllers/essay/create-essay.controller";

export function makeCreateEssayController() {
  const prismaEssayRepository = makePrismaEssayRepository();
  const prismaUserRepository = makeUserPrismaRepository();
  const prismaUserQuery = makePrismaUserQuery();
  const mapper = new EssayResDtoMapper();

  const createEssayUseCase = new CreateEssayUseCase({
    essayRepository: prismaEssayRepository,
    userRepository: prismaUserRepository,
    relationChecker: prismaUserQuery,
    mapper
  });

  const createEssayValidator = new ZodValidation(newEssaySchema);

  return new CreateEssayController({
    createEssayUseCase,
    createEssayValidator
  });
}

