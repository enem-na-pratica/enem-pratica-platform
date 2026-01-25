import type {
  Controller,
  ErrorResponse,
  HttpResponse,
  AuthenticatedRequest
} from '@/src/core/presentation/protocols';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Validator } from '@/src/core/domain/contracts/validation';
import type {
  CreateEssayDto,
  CreateEssayInput
} from '@/src/core/application/use-cases/essay';
import type { EssayDto } from '@/src/core/application/common/dtos';
import { handleError, created } from '@/src/core/presentation/helpers';

type CreateEssayControllerDeps = {
  createEssayUseCase: UseCase<CreateEssayInput, EssayDto>;
  validator: Validator<CreateEssayDto>;
}

export class CreateEssayController
  implements Controller<CreateEssayDto, EssayDto> {
  private readonly createEssayUseCase: UseCase<CreateEssayInput, EssayDto>;
  private readonly validator: Validator<CreateEssayDto>;

  constructor({ createEssayUseCase, validator }: CreateEssayControllerDeps) {
    this.createEssayUseCase = createEssayUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<CreateEssayDto>
  ): Promise<HttpResponse<EssayDto | ErrorResponse>> {
    try {
      const validatedData = this.validator.validate(request.body);

      const newEssay = await this.createEssayUseCase.execute({
        data: validatedData,
        requester: request.requester
      });

      return created(newEssay);
    } catch (error) {
      return handleError(error);
    }
  }
}