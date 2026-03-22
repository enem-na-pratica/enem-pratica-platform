import { UseCase } from '@/src/core/application/common/interfaces';
import type {
  ListSubjectProgressInput,
  TopicProgressDto,
} from '@/src/core/application/use-cases/subject/list-subject-progress';
import { Validator } from '@/src/core/domain/contracts';
import type { TopicStatus } from '@/src/core/domain/entities';
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
  statusValidator: Validator<TopicStatus[] | undefined>;
};

type ListSubjectProgressStatisticsParam = {
  subjectSlug: string;
  username: string;
};

type ListSubjectProgressStatisticsQuery = {
  status: string | string[];
};

export class ListSubjectProgressController implements Controller<
  void,
  TopicProgressDto[],
  ListSubjectProgressStatisticsParam,
  ListSubjectProgressStatisticsQuery
> {
  private readonly listSubjectProgressUseCase: UseCase<
    ListSubjectProgressInput,
    TopicProgressDto[]
  >;
  private readonly usernameValidator: Validator<string>;
  private readonly subjectSlugValidator: Validator<string>;
  private readonly statusValidator: Validator<TopicStatus[] | undefined>;

  constructor({
    listSubjectProgressUseCase,
    usernameValidator,
    subjectSlugValidator,
    statusValidator,
  }: ListSubjectProgressControllerDeps) {
    this.listSubjectProgressUseCase = listSubjectProgressUseCase;
    this.usernameValidator = usernameValidator;
    this.subjectSlugValidator = subjectSlugValidator;
    this.statusValidator = statusValidator;
  }

  async handle(
    request: AuthenticatedRequest<
      void,
      ListSubjectProgressStatisticsParam,
      ListSubjectProgressStatisticsQuery
    >,
  ): Promise<HttpResponse<TopicProgressDto[] | ErrorResponse>> {
    try {
      const rawSubjectSlug = request.params?.subjectSlug;
      const rawUsername = request.params?.username;

      const rawStatus = request.query?.status;

      const statusArray = rawStatus ? [rawStatus].flat() : undefined;
      const status = this.statusValidator.validate(statusArray);

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
          status,
        },
      );
      return ok(listSubjectProgress);
    } catch (error) {
      return handleError(error);
    }
  }
}
