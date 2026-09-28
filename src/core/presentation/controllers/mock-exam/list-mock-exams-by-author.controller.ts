import type { MockExamDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type { ListMockExamsByAuthorUseCaseInput } from '@/src/core/application/use-cases/mock-exam';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type ListMockExamsByAuthorControllerDeps = {
  listMockExamsByAuthorUseCase: UseCase<
    ListMockExamsByAuthorUseCaseInput,
    MockExamDto[]
  >;
  validator: Validator<string>;
};

type ListMockExamsByAuthorParam = { username: string };

export class ListMockExamsByAuthorController implements Controller<
  void,
  MockExamDto[],
  ListMockExamsByAuthorParam
> {
  private readonly listMockExamsByAuthorUseCase: UseCase<
    ListMockExamsByAuthorUseCaseInput,
    MockExamDto[]
  >;
  private readonly validator: Validator<string>;

  constructor({
    listMockExamsByAuthorUseCase,
    validator,
  }: ListMockExamsByAuthorControllerDeps) {
    this.listMockExamsByAuthorUseCase = listMockExamsByAuthorUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<void, ListMockExamsByAuthorParam>,
  ): Promise<HttpResponse<MockExamDto[] | ErrorResponse>> {
    try {
      const authorUsername = this.getAuthorUsername(
        request.params?.username,
        request.requester,
      );

      const listMockExamsWithStatistics =
        await this.listMockExamsByAuthorUseCase.execute({
          authorUsername,
          requester: request.requester,
        });

      return ok(listMockExamsWithStatistics);
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
