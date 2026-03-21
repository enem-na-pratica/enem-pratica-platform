import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  ListUserEssaysStatisticsInput,
  UserEssaysOverviewDto,
} from '@/src/core/application/use-cases/essay';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type ListUserEssaysStatisticsControllerDeps = {
  listUserEssaysStatisticsUseCase: UseCase<
    ListUserEssaysStatisticsInput,
    UserEssaysOverviewDto
  >;
  validator: Validator<string>;
};

type ListUserEssaysStatisticsParam = { username: string };

export class ListUserEssaysStatisticsController implements Controller<
  void,
  UserEssaysOverviewDto,
  ListUserEssaysStatisticsParam
> {
  private readonly listUserEssaysStatisticsUseCase: UseCase<
    ListUserEssaysStatisticsInput,
    UserEssaysOverviewDto
  >;
  private readonly validator: Validator<string>;

  constructor({
    listUserEssaysStatisticsUseCase,
    validator,
  }: ListUserEssaysStatisticsControllerDeps) {
    this.listUserEssaysStatisticsUseCase = listUserEssaysStatisticsUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<void, ListUserEssaysStatisticsParam>,
  ): Promise<HttpResponse<UserEssaysOverviewDto | ErrorResponse>> {
    try {
      const rawUsername = request.params?.username;

      const authorUsername = rawUsername
        ? this.validator.validate(rawUsername)
        : undefined;

      const listEssays = await this.listUserEssaysStatisticsUseCase.execute({
        authorUsername,
        requester: request.requester,
      });

      return ok(listEssays);
    } catch (error) {
      return handleError(error);
    }
  }
}
