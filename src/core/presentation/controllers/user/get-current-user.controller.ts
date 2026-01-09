import {
  Controller,
  ErrorResponse,
  HttpRequest,
  HttpResponse
} from '@/src/core/presentation/interfaces';
import { GetCurrentUser } from "@/src/core/application/interfaces/user/get-current-user-use-case.interface";
import { UserResDto } from '@/src/core/application/dtos/user';
import { UserNotFoundError } from '@/src/core/domain/errors';

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
    const { username } = request.body;

    try {
      const user = await this.getCurrentUserUseCase.execute(username);

      return {
        statusCode: 200,
        body: user,
      } as HttpResponse<UserResDto>;
    } catch (err: unknown) {
      if (err instanceof UserNotFoundError) {
        return {
          statusCode: 404,
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
