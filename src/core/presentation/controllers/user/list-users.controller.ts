import type { UserDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Role } from '@/src/core/domain/auth';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type ListUsersControllerDeps = {
  listUsersUseCase: UseCase<Role, UserDto[]>;
};

export class ListUsersController implements Controller<void, UserDto[]> {
  private readonly listUsersUseCase: UseCase<Role, UserDto[]>;

  constructor({ listUsersUseCase }: ListUsersControllerDeps) {
    this.listUsersUseCase = listUsersUseCase;
  }

  async handle(
    request: AuthenticatedRequest<void>,
  ): Promise<HttpResponse<UserDto[] | ErrorResponse>> {
    try {
      const listUsers = await this.listUsersUseCase.execute(
        request.requester.role,
      );

      return ok(listUsers);
    } catch (error) {
      return handleError(error);
    }
  }
}
