import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  ListUserEssaysStatisticsInput,
  UserEssaysOverviewDto
} from '@/src/core/application/use-cases/essay';
import type {
  Controller,
  ErrorResponse,
  HttpResponse,
  AuthenticatedRequest
} from '@/src/core/presentation/protocols';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, ok } from '@/src/core/presentation/helpers';

type ListUserEssaysStatisticsControllerDeps = {
  listUserEssaysStatisticsUseCase: UseCase<
    ListUserEssaysStatisticsInput,
    UserEssaysOverviewDto
  >;
  validator: Validator<string>;
}

export class ListUserEssaysStatisticsController
  implements Controller<void, UserEssaysOverviewDto> {
  private readonly listUserEssaysStatisticsUseCase: UseCase<
    ListUserEssaysStatisticsInput,
    UserEssaysOverviewDto
  >;
  private readonly validator: Validator<string>;

  constructor({
    listUserEssaysStatisticsUseCase,
    validator
  }: ListUserEssaysStatisticsControllerDeps) {
    this.listUserEssaysStatisticsUseCase = listUserEssaysStatisticsUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<void>
  ): Promise<HttpResponse<UserEssaysOverviewDto | ErrorResponse>> {
    try {
      const { username: rawUsername } = request.params ?? {};

      const authorUsername = rawUsername
        ? this.validator.validate(rawUsername)
        : undefined;

      const listEssays = await this.listUserEssaysStatisticsUseCase.execute({
        authorUsername,
        requester: request.requester,
      });

      return ok(listEssays);
    } catch (error) {
      return handleError(error)
    }
  }
}