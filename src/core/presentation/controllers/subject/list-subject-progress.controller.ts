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
  validator: Validator<string>;
};

export class ListSubjectProgressController implements Controller<
  void,
  TopicProgressDto[]
> {
  private readonly listSubjectProgressUseCase: UseCase<
    ListSubjectProgressInput,
    TopicProgressDto[]
  >;
  private readonly validator: Validator<string>;

  constructor({
    listSubjectProgressUseCase,
    validator,
  }: ListSubjectProgressControllerDeps) {
    this.listSubjectProgressUseCase = listSubjectProgressUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<void>,
  ): Promise<HttpResponse<TopicProgressDto[] | ErrorResponse>> {
    try {
      const { subjectName } = request.params! as { subjectName: string };
      const { username: rawUsername } = request.query ?? {};

      const targetUsername =
        rawUsername === 'me'
          ? request.requester.username
          : this.validator.validate(rawUsername);

      const listSubjectProgress = await this.listSubjectProgressUseCase.execute(
        {
          subjectName,
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
