import { CreateQuestionSessionUseCase } from '@/src/core/application/use-cases/question-session/create-question-session';
import {
  ZodValidator,
  createQuestionSessionSchema,
} from '@/src/core/infrastructure/validation/zod';
import { makeQuestionSessionDtoMapper } from '@/src/core/main/factories/common/mappers';
import { makePrismaQuestionSessionRepository } from '@/src/core/main/factories/common/repositories';
import { makeUserAccessService } from '@/src/core/main/factories/common/services';
import { CreateQuestionSessionController } from '@/src/core/presentation/controllers/question-session';

export function makeCreateQuestionSession() {
  const createQuestionSessionUseCase = new CreateQuestionSessionUseCase({
    mapper: makeQuestionSessionDtoMapper(),
    userAccessService: makeUserAccessService(),
    questionSessionRepository: makePrismaQuestionSessionRepository(),
  });

  const zodValidator = new ZodValidator(createQuestionSessionSchema);

  return new CreateQuestionSessionController({
    validator: zodValidator,
    createQuestionSessionUseCase,
  });
}
