import type { QuestionSessionDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  SetIsReviewedDto,
  SetIsReviewedInput,
} from '@/src/core/application/use-cases/question-session/set-is-reviewed';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type SetIsReviewedControllerDeps = {
  setIsReviewedUseCase: UseCase<SetIsReviewedInput, QuestionSessionDto>;
  validator: Validator<SetIsReviewedDto>;
};

export class SetIsReviewedController implements Controller<
  Pick<SetIsReviewedDto, 'isReviewed'>,
  QuestionSessionDto
> {
  private readonly setIsReviewedUseCase: UseCase<
    SetIsReviewedInput,
    QuestionSessionDto
  >;
  private readonly validator: Validator<SetIsReviewedDto>;

  constructor({
    setIsReviewedUseCase,
    validator,
  }: SetIsReviewedControllerDeps) {
    this.setIsReviewedUseCase = setIsReviewedUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<Pick<SetIsReviewedDto, 'isReviewed'>>,
  ): Promise<HttpResponse<QuestionSessionDto | ErrorResponse>> {
    try {
      const { questionSessionId: rawQuestionSessionId } = request.params ?? {};

      const validatedData = this.validator.validate({
        questionSessionId: rawQuestionSessionId,
        isReviewed: request.body.isReviewed,
      });

      const questionSession = await this.setIsReviewedUseCase.execute({
        data: validatedData,
        requester: request.requester,
      });

      return ok(questionSession);
    } catch (error) {
      return handleError(error);
    }
  }
}
