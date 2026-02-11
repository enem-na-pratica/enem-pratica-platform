import { CreateMockExamController } from "@/src/core/presentation/controllers/mock-exam";
import { CreateMockExamUseCase } from "@/src/core/application/use-cases/mock-exam";
import { makePrismaMockExamRepository } from "@/src/core/main/factories/common/repositories";
import { makeUserAccessService } from "@/src/core/main/factories/common/services";
import { makeMockExamDtoMapper } from "@/src/core/main/factories/common/mappers";
import {
  ZodValidator,
  createMockExamSchema
} from "@/src/core/infrastructure/validation/zod";

export function makeCreateMockExam() {
  const createMockExamUseCase = new CreateMockExamUseCase({
    mockExamRepository: makePrismaMockExamRepository(),
    userAccessService: makeUserAccessService(),
    mapper: makeMockExamDtoMapper(),
  });

  const validator = new ZodValidator(createMockExamSchema);

  return new CreateMockExamController({
    createMockExamUseCase,
    validator,
  });
}