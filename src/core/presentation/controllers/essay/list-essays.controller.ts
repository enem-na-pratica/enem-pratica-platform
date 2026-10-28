import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  EssayPaginatedResponse,
  EssayPaginationParams,
  ListEssaysInput,
} from '@/src/core/application/use-cases/essay/list-essays/';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type EssayQuery = {
  page: number;
  limit: number;
  sortBy: EssayPaginationParams['sortBy'];
  sortOrder: 'asc' | 'desc';
  theme?: string;
  startDate?: Date;
  endDate?: Date;
};

type RawQuery = Partial<Record<keyof EssayQuery, string>>;

type ListEssaysParams = { username: string };

type ListEssaysControllerDeps = {
  listEssaysUseCase: UseCase<ListEssaysInput, EssayPaginatedResponse>;
  usernameValidator: Validator<string>;
  listEssaysQueryValidator: Validator<EssayQuery>;
};

export class ListEssaysController implements Controller<
  void,
  EssayPaginatedResponse,
  ListEssaysParams,
  RawQuery
> {
  private readonly listEssaysUseCase: UseCase<
    ListEssaysInput,
    EssayPaginatedResponse
  >;
  private readonly usernameValidator: Validator<string>;
  private readonly listEssaysQueryValidator: Validator<EssayQuery>;

  constructor({
    listEssaysUseCase,
    usernameValidator,
    listEssaysQueryValidator,
  }: ListEssaysControllerDeps) {
    this.listEssaysUseCase = listEssaysUseCase;
    this.usernameValidator = usernameValidator;
    this.listEssaysQueryValidator = listEssaysQueryValidator;
  }

  async handle(
    request: AuthenticatedRequest<void, ListEssaysParams, RawQuery>,
  ): Promise<HttpResponse<EssayPaginatedResponse | ErrorResponse>> {
    try {
      const authorId = this.resolveAuthorId(
        request.params?.username,
        request.requester,
      );

      const { page, limit, sortBy, sortOrder, ...filters } =
        this.listEssaysQueryValidator.validate(request.query);

      const essays = await this.listEssaysUseCase.execute({
        essayPaginationParams: {
          page,
          limit,
          sortBy,
          sortOrder,
          filters: { ...filters, authorId },
        },
        requester: request.requester,
      });

      return ok(essays);
    } catch (error) {
      return handleError(error);
    }
  }

  private resolveAuthorId(
    rawUsername: string | undefined,
    requester: AuthenticatedRequest['requester'],
  ): string {
    if (rawUsername === 'me') return requester.username;

    return this.usernameValidator.validate(rawUsername);
  }
}
