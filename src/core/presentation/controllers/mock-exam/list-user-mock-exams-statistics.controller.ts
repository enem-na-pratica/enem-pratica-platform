import { UseCase } from '@/src/core/application/common/interfaces';
import type {
  ListUserMockExamsStatisticsInput,
  UserMockExamsOverviewDto,
} from '@/src/core/application/use-cases/mock-exam';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type ListUserMockExamsStatisticsControllerDeps = {
  listUserMockExamsStatisticsUseCase: UseCase<
    ListUserMockExamsStatisticsInput,
    UserMockExamsOverviewDto
  >;
  validator: Validator<string>;
};

type ListUserMockExamsStatisticsParam = { username: string };

export class ListUserMockExamsStatisticsController implements Controller<
  void,
  UserMockExamsOverviewDto,
  ListUserMockExamsStatisticsParam
> {
  private readonly listUserMockExamsStatisticsUseCase: UseCase<
    ListUserMockExamsStatisticsInput,
    UserMockExamsOverviewDto
  >;
  private readonly validator: Validator<string>;

  constructor({
    listUserMockExamsStatisticsUseCase,
    validator,
  }: ListUserMockExamsStatisticsControllerDeps) {
    this.listUserMockExamsStatisticsUseCase =
      listUserMockExamsStatisticsUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<void, ListUserMockExamsStatisticsParam>,
  ): Promise<HttpResponse<UserMockExamsOverviewDto | ErrorResponse>> {
    try {
      const rawUsername = request.params?.username;

      const authorUsername = rawUsername
        ? this.validator.validate(rawUsername)
        : undefined;

      const listMockExamsWithStatistics =
        await this.listUserMockExamsStatisticsUseCase.execute({
          authorUsername,
          requester: request.requester,
        });

      return ok(listMockExamsWithStatistics);
    } catch (error) {
      return handleError(error);
    }
  }
}
