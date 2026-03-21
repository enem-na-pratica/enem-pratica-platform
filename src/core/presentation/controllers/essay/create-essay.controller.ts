import type { EssayDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  CreateEssayDto,
  CreateEssayInput,
} from '@/src/core/application/use-cases/essay';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { created, handleError } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type CreateEssayControllerDeps = {
  createEssayUseCase: UseCase<CreateEssayInput, EssayDto>;
  validator: Validator<CreateEssayDto>;
};

type CreateEssayRequestBody = Prettify<Omit<CreateEssayDto, 'authorUsername'>>;
type CreateEssayRequestParam = { username: string };

export class CreateEssayController implements Controller<
  CreateEssayRequestBody,
  EssayDto,
  CreateEssayRequestParam
> {
  private readonly createEssayUseCase: UseCase<CreateEssayInput, EssayDto>;
  private readonly validator: Validator<CreateEssayDto>;

  constructor({ createEssayUseCase, validator }: CreateEssayControllerDeps) {
    this.createEssayUseCase = createEssayUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<
      CreateEssayRequestBody,
      CreateEssayRequestParam
    >,
  ): Promise<HttpResponse<EssayDto | ErrorResponse>> {
    try {
      const rawUsername = request.params?.username;
      const rawCreateEssay = request.body;

      const rawData: CreateEssayDto = {
        authorUsername: rawUsername,
        ...rawCreateEssay,
      };

      const validatedData = this.validator.validate(rawData);

      const newEssay = await this.createEssayUseCase.execute({
        data: validatedData,
        requester: request.requester,
      });

      return created(newEssay);
    } catch (error) {
      return handleError(error);
    }
  }
}
