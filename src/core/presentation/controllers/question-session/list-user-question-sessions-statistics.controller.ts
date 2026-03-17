import { UseCase } from '@/src/core/application/common/interfaces';
import type {
  ListUserQuestionSessionsStatisticsInput,
  UserQuestionSessionsOverviewDto,
} from '@/src/core/application/use-cases/question-session/list-user-question-session-statistics';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type ListUserQuestionSessionsStatisticsControllerDeps = {
  listUserQuestionSessionsStatisticsUseCase: UseCase<
    ListUserQuestionSessionsStatisticsInput,
    UserQuestionSessionsOverviewDto
  >;
  validator: Validator<string>;
};

export class ListUserQuestionSessionsStatisticsController implements Controller<
  void,
  UserQuestionSessionsOverviewDto
> {
  private readonly listUserQuestionSessionsStatisticsUseCase: UseCase<
    ListUserQuestionSessionsStatisticsInput,
    UserQuestionSessionsOverviewDto
  >;
  private readonly validator: Validator<string>;

  constructor({
    listUserQuestionSessionsStatisticsUseCase,
    validator,
  }: ListUserQuestionSessionsStatisticsControllerDeps) {
    this.listUserQuestionSessionsStatisticsUseCase =
      listUserQuestionSessionsStatisticsUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<void>,
  ): Promise<HttpResponse<UserQuestionSessionsOverviewDto | ErrorResponse>> {
    try {
      const { username: rawUsername } = request.params!;

      const authorUsername =
        rawUsername === 'me'
          ? request.requester.username
          : this.validator.validate(rawUsername);

      const overview =
        await this.listUserQuestionSessionsStatisticsUseCase.execute({
          authorUsername,
          requester: request.requester,
        });

      return ok(overview);
    } catch (error) {
      return handleError(error);
    }
  }
}
