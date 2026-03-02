import { UseCase } from '@/src/core/application/common/interfaces';
import type {
  ListSubjectProgressInput,
  TopicProgressDto,
} from '@/src/core/application/use-cases/subject/list-subject-progress';
import { Validator } from '@/src/core/domain/contracts';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type ListSubjectProgressControllerDeps = {
  listSubjectProgressUseCase: UseCase<
    ListSubjectProgressInput,
    TopicProgressDto[]
  >;
  usernameValidator: Validator<string>;
  subjectSlugValidator: Validator<string>;
};

export class ListSubjectProgressController implements Controller<
  void,
  TopicProgressDto[]
> {
  private readonly listSubjectProgressUseCase: UseCase<
    ListSubjectProgressInput,
    TopicProgressDto[]
  >;
  private readonly usernameValidator: Validator<string>;
  private readonly subjectSlugValidator: Validator<string>;

  constructor({
    listSubjectProgressUseCase,
    usernameValidator,
    subjectSlugValidator,
  }: ListSubjectProgressControllerDeps) {
    this.listSubjectProgressUseCase = listSubjectProgressUseCase;
    this.usernameValidator = usernameValidator;
    this.subjectSlugValidator = subjectSlugValidator;
  }

  async handle(
    request: AuthenticatedRequest<void>,
  ): Promise<HttpResponse<TopicProgressDto[] | ErrorResponse>> {
    try {
      const { subjectSlug: rawSubjectSlug, username: rawUsername } =
        request.params ?? {};

      const subjectSlug = this.subjectSlugValidator.validate(rawSubjectSlug);

      const targetUsername =
        rawUsername === 'me'
          ? request.requester.username
          : this.usernameValidator.validate(rawUsername);

      const listSubjectProgress = await this.listSubjectProgressUseCase.execute(
        {
          subjectSlug,
          targetUsername,
          requester: request.requester,
        },
      );
      return ok(listSubjectProgress);
    } catch (error) {
      return handleError(error);
    }
  }
}
