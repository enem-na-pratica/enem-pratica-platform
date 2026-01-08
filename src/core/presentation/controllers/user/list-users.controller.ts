import {
  Controller,
  ErrorResponse,
  HttpRequest,
  HttpResponse
} from '@/src/core/presentation/interfaces';
import { UserDTO } from '@/src/core/application/dtos/user';
import { ForbiddenError } from '@/src/core/domain/errors';
import { Role } from '@/src/core/domain/auth/roles';
import { ListUsers } from '@/src/core/application/interfaces/user/list-users-use-case.interface';

export type GetCurrentUserDep = {
  listUsersUseCase: ListUsers;
}

export class ListUsersController
  implements Controller<Role, UserDTO[]> {
  private readonly listUsersUseCase: ListUsers;

  constructor(deps: GetCurrentUserDep) {
    this.listUsersUseCase = deps.listUsersUseCase;
  }

  async handle(
    request: HttpRequest<Role>
  ): Promise<HttpResponse<UserDTO[] | ErrorResponse>> {
    const role = request.body
    try {
      const users = await this.listUsersUseCase.execute(role);

      return {
        statusCode: 200,
        body: users,
      };
    } catch (err: unknown) {
      if (err instanceof ForbiddenError) {
        return {
          statusCode: 403,
          body: { message: err.message },
        };
      }

      const error = err as Error;
      return {
        statusCode: 500,
        body: { message: error.message || "Erro inesperado." },
      };
    }
  }

}