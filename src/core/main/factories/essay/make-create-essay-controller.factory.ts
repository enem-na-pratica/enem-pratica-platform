import { CreateEssayController } from "@/src/core/presentation/controllers/essay";
import { CreateEssayUseCase } from "@/src/core/application/use-cases/essay";
import {
  makePrismaUserRepository,
  makePrismaEssayRepository,
  makePrismaStudentTeacherRepository
} from "@/src/core/main/factories/common/repositories";
import {
  ZodValidator,
  createEssaySchema
} from "@/src/core/infrastructure/validation/zod";
import { makeEssayDtoMapper } from "@/src/core/main/factories/common/mappers";

export function makeCreateEssayController() {
  const createEssayUseCase = new CreateEssayUseCase({
    essayRepository: makePrismaEssayRepository(),
    userRepository: makePrismaUserRepository(),
    studentTeacherRepository: makePrismaStudentTeacherRepository(),
    mapper: makeEssayDtoMapper(),
  });

  const zodValidator = new ZodValidator(createEssaySchema);

  return new CreateEssayController({
    createEssayUseCase,
    validator: zodValidator,
  });
}