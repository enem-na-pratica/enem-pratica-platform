import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  GetQuestionSessionStatsByAuthorInput,
  QuestionSessionStatsDto,
} from '@/src/core/application/use-cases/question-session';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type GetQuestionSessionStatsByAuthorControllerDeps = {
  getQuestionSessionStatsByAuthorUseCase: UseCase<
    GetQuestionSessionStatsByAuthorInput,
    QuestionSessionStatsDto
  >;
  validator: Validator<string>;
};

type GetQuestionSessionStatsByAuthorParam = { username: string };

export class GetQuestionSessionStatsByAuthorController implements Controller<
  void,
  QuestionSessionStatsDto,
  GetQuestionSessionStatsByAuthorParam
> {
  private readonly getQuestionSessionStatsByAuthorUseCase: UseCase<
    GetQuestionSessionStatsByAuthorInput,
    QuestionSessionStatsDto
  >;
  private readonly validator: Validator<string>;

  constructor({
    getQuestionSessionStatsByAuthorUseCase,
    validator,
  }: GetQuestionSessionStatsByAuthorControllerDeps) {
    this.getQuestionSessionStatsByAuthorUseCase =
      getQuestionSessionStatsByAuthorUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<void, GetQuestionSessionStatsByAuthorParam>,
  ): Promise<HttpResponse<QuestionSessionStatsDto | ErrorResponse>> {
    try {
      const authorUsername = this.getAuthorUsername(
        request.params?.username,
        request.requester,
      );

      const questionSessionStats =
        await this.getQuestionSessionStatsByAuthorUseCase.execute({
          authorUsername,
          requester: request.requester,
        });

      return ok(questionSessionStats);
    } catch (error) {
      return handleError(error);
    }
  }

  private getAuthorUsername(
    rawUsername: string | undefined,
    requester: AuthenticatedRequest['requester'],
  ): string {
    if (rawUsername === 'me') return requester.username;

    return this.validator.validate(rawUsername);
  }
}
