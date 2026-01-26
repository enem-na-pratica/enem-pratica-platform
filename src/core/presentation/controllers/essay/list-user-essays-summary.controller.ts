import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  ListUserEssaysSummaryInput,
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

type ListUserEssaysSummaryControllerDeps = {
  listUserEssaysSummaryUseCase: UseCase<
    ListUserEssaysSummaryInput,
    UserEssaysOverviewDto
  >;
  validator: Validator<string>;
}

export class ListUserEssaysSummaryController
  implements Controller<void, UserEssaysOverviewDto> {
  private readonly listUserEssaysSummaryUseCase: UseCase<
    ListUserEssaysSummaryInput,
    UserEssaysOverviewDto
  >;
  private readonly validator: Validator<string>;

  constructor({
    listUserEssaysSummaryUseCase,
    validator
  }: ListUserEssaysSummaryControllerDeps) {
    this.listUserEssaysSummaryUseCase = listUserEssaysSummaryUseCase;
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

      const listEssays = await this.listUserEssaysSummaryUseCase.execute({
        authorUsername,
        requester: request.requester,
      });

      return ok(listEssays);
    } catch (error) {
      return handleError(error)
    }
  }
}