import type { QuestionSessionDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  CreateQuestionSessionDto,
  CreateQuestionSessionInput,
} from '@/src/core/application/use-cases/question-session/create-question-session';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { created, handleError } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type CreateQuestionSessionControllerDeps = {
  createQuestionSessionUseCase: UseCase<
    CreateQuestionSessionInput,
    QuestionSessionDto
  >;
  validator: Validator<CreateQuestionSessionDto>;
};

export class CreateQuestionSessionController implements Controller<
  CreateQuestionSessionDto,
  QuestionSessionDto
> {
  private readonly createQuestionSessionUseCase: UseCase<
    CreateQuestionSessionInput,
    QuestionSessionDto
  >;
  private readonly validator: Validator<CreateQuestionSessionDto>;

  constructor({
    createQuestionSessionUseCase,
    validator,
  }: CreateQuestionSessionControllerDeps) {
    this.createQuestionSessionUseCase = createQuestionSessionUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<CreateQuestionSessionDto>,
  ): Promise<HttpResponse<QuestionSessionDto | ErrorResponse>> {
    try {
      const validatedData = this.validator.validate(request.body);

      const newQuestionSession =
        await this.createQuestionSessionUseCase.execute({
          data: validatedData,
          requester: request.requester,
        });

      return created(newQuestionSession);
    } catch (error) {
      return handleError(error);
    }
  }
}
