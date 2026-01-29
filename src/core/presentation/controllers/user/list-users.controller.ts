import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  Controller,
  ErrorResponse,
  HttpResponse,
  AuthenticatedRequest
} from '@/src/core/presentation/protocols';
import type { UserDto } from '@/src/core/application/common/dtos';
import type { Role } from '@/src/core/domain/auth';
import { handleError, ok } from '@/src/core/presentation/helpers';

type ListUsersControllerDeps = {
  listUsersUseCase: UseCase<Role, UserDto[]>;
}

export class ListUsersController
  implements Controller<void, UserDto[]> {
  private readonly listUsersUseCase: UseCase<Role, UserDto[]>;

  constructor({
    listUsersUseCase,
  }: ListUsersControllerDeps) {
    this.listUsersUseCase = listUsersUseCase;
  }

  async handle(
    request: AuthenticatedRequest<void>
  ): Promise<HttpResponse<UserDto[] | ErrorResponse>> {
    try {
      const listUsers = await this.listUsersUseCase.execute(
        request.requester.role
      );

      return ok(listUsers);
    } catch (error) {
      return handleError(error);
    }
  }
}