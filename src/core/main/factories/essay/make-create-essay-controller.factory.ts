import { CreateEssayController } from "@/src/core/presentation/controllers/essay";
import { CreateEssayUseCase } from "@/src/core/application/use-cases/essay";
import {
  makePrismaUserRepository,
  makePrismaEssayRepository,
  makePrismaStudentTeacherRepository
} from "@/src/core/main/factories/common/repositories";
import { EssayDtoMapper } from "@/src/core/application/mapper";
import {
  ZodValidator,
  createEssaySchema
} from "@/src/core/infrastructure/validation/zod";

export function makeCreateEssayController() {
  const essayDtoMapper = new EssayDtoMapper();
  const createEssayUseCase = new CreateEssayUseCase({
    essayRepository: makePrismaEssayRepository(),
    userRepository: makePrismaUserRepository(),
    studentTeacherRepository: makePrismaStudentTeacherRepository(),
    mapper: essayDtoMapper,
  });

  const zodValidator = new ZodValidator(createEssaySchema);

  return new CreateEssayController({
    createEssayUseCase,
    validator: zodValidator,
  });
}