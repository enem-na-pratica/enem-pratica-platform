import type { UserTopicProgressDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  SetTopicStatusDto,
  SetTopicStatusInput,
} from '@/src/core/application/use-cases/user-topic-progress';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type SetTopicStatusDeps = {
  setTopicStatusUseCase: UseCase<SetTopicStatusInput, UserTopicProgressDto>;
  validator: Validator<SetTopicStatusDto>;
};

export class SetTopicStatusController implements Controller<
  SetTopicStatusInput,
  UserTopicProgressDto
> {
  private readonly setTopicStatusUseCase: UseCase<
    SetTopicStatusInput,
    UserTopicProgressDto
  >;
  private readonly validator: Validator<SetTopicStatusDto>;

  constructor({ setTopicStatusUseCase, validator }: SetTopicStatusDeps) {
    this.setTopicStatusUseCase = setTopicStatusUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<SetTopicStatusInput>,
  ): Promise<HttpResponse<UserTopicProgressDto | ErrorResponse>> {
    try {
      const validatedData = this.validator.validate(request.body);

      const topicStatus = await this.setTopicStatusUseCase.execute({
        data: validatedData,
        requester: request.requester,
      });

      return ok(topicStatus);
    } catch (error) {
      return handleError(error);
    }
  }
}
