import { SetIsReviewedUseCase } from '@/src/core/application/use-cases/question-session/set-is-reviewed';
import {
  ZodValidator,
  setIsReviewedSchema,
} from '@/src/core/infrastructure/validation/zod';
import { makeQuestionSessionDtoMapper } from '@/src/core/main/factories/common/mappers';
import { makePrismaQuestionSessionRepository } from '@/src/core/main/factories/common/repositories';
import { makeUserAccessService } from '@/src/core/main/factories/common/services';
import { SetIsReviewedController } from '@/src/core/presentation/controllers/question-session';

export function makeSetIsReviewed() {
  const setIsReviewedUseCase = new SetIsReviewedUseCase({
    mapper: makeQuestionSessionDtoMapper(),
    userAccessService: makeUserAccessService(),
    questionSessionRepository: makePrismaQuestionSessionRepository(),
  });

  const zodValidator = new ZodValidator(setIsReviewedSchema);

  return new SetIsReviewedController({
    validator: zodValidator,
    setIsReviewedUseCase,
  });
}
