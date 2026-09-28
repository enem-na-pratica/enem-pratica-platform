import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  GetAuthorMockExamStatsInput,
  MockExamStatsDto,
} from '@/src/core/application/use-cases/mock-exam';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type GetAuthorMockExamStatsControllerDeps = {
  getAuthorMockExamStatsUseCase: UseCase<
    GetAuthorMockExamStatsInput,
    MockExamStatsDto
  >;
  validator: Validator<string>;
};

type GetAuthorMockExamStatsParam = { username: string };

export class GetAuthorMockExamStatsController implements Controller<
  void,
  MockExamStatsDto,
  GetAuthorMockExamStatsParam
> {
  private readonly getAuthorMockExamStatsUseCase: UseCase<
    GetAuthorMockExamStatsInput,
    MockExamStatsDto
  >;
  private readonly validator: Validator<string>;

  constructor({
    getAuthorMockExamStatsUseCase,
    validator,
  }: GetAuthorMockExamStatsControllerDeps) {
    this.getAuthorMockExamStatsUseCase = getAuthorMockExamStatsUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<void, GetAuthorMockExamStatsParam>,
  ): Promise<HttpResponse<MockExamStatsDto | ErrorResponse>> {
    try {
      const authorUsername = this.getAuthorUsername(
        request.params?.username,
        request.requester,
      );

      const mockExamStats = await this.getAuthorMockExamStatsUseCase.execute({
        authorUsername,
        requester: request.requester,
      });

      return ok(mockExamStats);
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
