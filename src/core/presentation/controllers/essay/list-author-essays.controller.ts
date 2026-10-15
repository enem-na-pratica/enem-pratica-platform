import type { EssayDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type { ListAuthorEssaysInput } from '@/src/core/application/use-cases/essay';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type ListAuthorEssaysControllerDeps = {
  listAuthorEssaysUseCase: UseCase<ListAuthorEssaysInput, EssayDto[]>;
  usernameValidator: Validator<string>;
};

type ListAuthorEssaysParam = { username: string };

export class ListAuthorEssaysController implements Controller<
  void,
  EssayDto[],
  ListAuthorEssaysParam
> {
  private readonly listAuthorEssaysUseCase: UseCase<
    ListAuthorEssaysInput,
    EssayDto[]
  >;
  private readonly usernameValidator: Validator<string>;

  constructor({
    listAuthorEssaysUseCase,
    usernameValidator,
  }: ListAuthorEssaysControllerDeps) {
    this.listAuthorEssaysUseCase = listAuthorEssaysUseCase;
    this.usernameValidator = usernameValidator;
  }

  async handle(
    request: AuthenticatedRequest<void, ListAuthorEssaysParam>,
  ): Promise<HttpResponse<EssayDto[] | ErrorResponse>> {
    try {
      const authorUsername = this.getAuthorUsername(
        request.params?.username,
        request.requester,
      );

      const listEssays = await this.listAuthorEssaysUseCase.execute({
        authorUsername,
        requester: request.requester,
      });

      return ok(listEssays);
    } catch (error) {
      return handleError(error);
    }
  }

  private getAuthorUsername(
    rawUsername: string | undefined,
    requester: AuthenticatedRequest['requester'],
  ): string {
    if (rawUsername === 'me') return requester.username;

    return this.usernameValidator.validate(rawUsername);
  }
}
