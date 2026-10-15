import { UseCase } from '@/src/core/application/common/interfaces';
import type {
  ListQuestionSessionsByAuthorInput,
  QuestionSessionExtendedDto,
} from '@/src/core/application/use-cases/question-session';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type ListQuestionSessionsByAuthorControllerDeps = {
  listQuestionSessionsByAuthorUseCase: UseCase<
    ListQuestionSessionsByAuthorInput,
    QuestionSessionExtendedDto[]
  >;
  validator: Validator<string>;
};

type ListQuestionSessionsByAuthorParam = { username: string };

export class ListQuestionSessionsByAuthorController implements Controller<
  void,
  QuestionSessionExtendedDto[],
  ListQuestionSessionsByAuthorParam
> {
  private readonly listQuestionSessionsByAuthorUseCase: UseCase<
    ListQuestionSessionsByAuthorInput,
    QuestionSessionExtendedDto[]
  >;
  private readonly validator: Validator<string>;

  constructor({
    listQuestionSessionsByAuthorUseCase,
    validator,
  }: ListQuestionSessionsByAuthorControllerDeps) {
    this.listQuestionSessionsByAuthorUseCase =
      listQuestionSessionsByAuthorUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<void, ListQuestionSessionsByAuthorParam>,
  ): Promise<HttpResponse<QuestionSessionExtendedDto[] | ErrorResponse>> {
    try {
      const rawUsername = request.params?.username;

      const authorUsername =
        rawUsername === 'me'
          ? request.requester.username
          : this.validator.validate(rawUsername);

      const overview = await this.listQuestionSessionsByAuthorUseCase.execute({
        authorUsername,
        requester: request.requester,
      });

      return ok(overview);
    } catch (error) {
      return handleError(error);
    }
  }
}
