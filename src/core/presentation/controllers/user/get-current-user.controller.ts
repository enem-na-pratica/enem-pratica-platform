import {
  Controller,
  ErrorResponse,
  HttpRequest,
  HttpResponse
} from '@/src/core/presentation/interfaces';
import { GetCurrentUser } from "@/src/core/application/interfaces/user/get-current-user-use-case.interface";
import { UserResDto } from '@/src/core/application/dtos/user';
import * as Http from '@/src/core/presentation/helpers/http.helper';
import { handleError } from '@/src/core/presentation/helpers/error-handler.helper';

export type GetCurrentUserDep = {
  getCurrentUserUseCase: GetCurrentUser;
}

export class GetCurrentUserController
  implements Controller<{ username: string }, UserResDto> {
  private readonly getCurrentUserUseCase: GetCurrentUser;

  constructor(deps: GetCurrentUserDep) {
    this.getCurrentUserUseCase = deps.getCurrentUserUseCase;
  }

  async handle(
    request: HttpRequest<{ username: string }>
  ): Promise<HttpResponse<UserResDto | ErrorResponse>> {
    try {
      const { username } = request.body;

      const user = await this.getCurrentUserUseCase.execute(username);

      return Http.ok(user);
    } catch (error) {
      return handleError(error);
    }
  }
}
