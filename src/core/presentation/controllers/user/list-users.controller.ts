import {
  Controller,
  ErrorResponse,
  HttpRequest,
  HttpResponse
} from '@/src/core/presentation/interfaces';
import { UserResDto } from '@/src/core/application/dtos/user';
import { Role } from '@/src/core/domain/auth/roles';
import { ListUsers } from '@/src/core/application/interfaces/user/list-users-use-case.interface';
import * as Http from '@/src/core/presentation/helpers/http.helper';
import { handleError } from '@/src/core/presentation/helpers/error-handler.helper';

export type GetCurrentUserDep = {
  listUsersUseCase: ListUsers;
}

export class ListUsersController
  implements Controller<{ role: Role }, UserResDto[]> {
  private readonly listUsersUseCase: ListUsers;

  constructor(deps: GetCurrentUserDep) {
    this.listUsersUseCase = deps.listUsersUseCase;
  }

  async handle(
    request: HttpRequest<{ role: Role }>
  ): Promise<HttpResponse<UserResDto[] | ErrorResponse>> {
    try {
      const { role } = request.body;

      const users = await this.listUsersUseCase.execute(role);

      return Http.ok(users);
    } catch (error) {
      return handleError(error);
    }
  }

}