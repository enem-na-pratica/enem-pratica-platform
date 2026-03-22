import { CreateEssayUseCase } from '@/src/core/application/use-cases/essay';
import {
  ZodValidator,
  createEssaySchema,
} from '@/src/core/infrastructure/validation/zod';
import { makeEssayDtoMapper } from '@/src/core/main/factories/common/mappers';
import { makePrismaEssayRepository } from '@/src/core/main/factories/common/repositories';
import { makeUserAccessService } from '@/src/core/main/factories/common/services';
import { CreateEssayController } from '@/src/core/presentation/controllers/essay';

export function makeCreateEssay() {
  const createEssayUseCase = new CreateEssayUseCase({
    essayRepository: makePrismaEssayRepository(),
    userAccessService: makeUserAccessService(),
    mapper: makeEssayDtoMapper(),
  });

  const zodValidator = new ZodValidator(createEssaySchema);

  return new CreateEssayController({
    createEssayUseCase,
    validator: zodValidator,
  });
}
