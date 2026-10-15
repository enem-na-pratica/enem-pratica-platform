import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  EssayStatsDto,
  GetEssaysStatsByUserInput,
} from '@/src/core/application/use-cases/essay/get-author-essay-stats';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type GetAuthorEssaysStatsControllerDeps = {
  getAuthorEssaysStatsUseCase: UseCase<
    GetEssaysStatsByUserInput,
    EssayStatsDto
  >;
  validator: Validator<string>;
};

type GetAuthorEssaysStatsParam = { username: string };

export class GetAuthorEssaysStatsController implements Controller<
  void,
  EssayStatsDto,
  GetAuthorEssaysStatsParam
> {
  private readonly getAuthorEssaysStatsUseCase: UseCase<
    GetEssaysStatsByUserInput,
    EssayStatsDto
  >;
  private readonly validator: Validator<string>;

  constructor({
    getAuthorEssaysStatsUseCase,
    validator,
  }: GetAuthorEssaysStatsControllerDeps) {
    this.getAuthorEssaysStatsUseCase = getAuthorEssaysStatsUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<void, GetAuthorEssaysStatsParam>,
  ): Promise<HttpResponse<EssayStatsDto | ErrorResponse>> {
    try {
      const authorUsername = this.getAuthorUsername(
        request.params?.username,
        request.requester,
      );

      const essayStats = await this.getAuthorEssaysStatsUseCase.execute({
        authorUsername,
        requester: request.requester,
      });

      return ok(essayStats);
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
