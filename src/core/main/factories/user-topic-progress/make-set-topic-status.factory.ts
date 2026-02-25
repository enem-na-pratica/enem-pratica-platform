import { SetTopicStatusUseCase } from '@/src/core/application/use-cases/user-topic-progress';
import {
  ZodValidator,
  setTopicStatusSchema,
} from '@/src/core/infrastructure/validation/zod';
import { makeUserTopicProgressDtoMapper } from '@/src/core/main/factories/common/mappers';
import { makePrismaUserTopicProgressRepository } from '@/src/core/main/factories/common/repositories';
import { makeUserAccessService } from '@/src/core/main/factories/common/services';
import { SetTopicStatusController } from '@/src/core/presentation/controllers/user-topic-progress';

export function makeSetTopicStatus() {
  const setTopicStatusUseCase = new SetTopicStatusUseCase({
    mapper: makeUserTopicProgressDtoMapper(),
    userAccessService: makeUserAccessService(),
    userTopicProgressRepository: makePrismaUserTopicProgressRepository(),
  });

  const zodValidator = new ZodValidator(setTopicStatusSchema);

  return new SetTopicStatusController({
    validator: zodValidator,
    setTopicStatusUseCase,
  });
}
