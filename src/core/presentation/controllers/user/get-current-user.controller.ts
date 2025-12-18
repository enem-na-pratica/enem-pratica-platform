import { Controller, HttpRequest, HttpResponse } from '@/src/core/presentation/interfaces';
import { GetCurrentUser } from "@/src/core/application/interfaces/user/get-current-user-use-case.interface";
import { UserDTO } from '@/src/core/application/dtos/user';
import { UserNotFoundError } from '@/src/core/domain/errors';

export type GetCurrentUserDep = {
  getCurrentUserUseCase: GetCurrentUser;
}

export class GetCurrentUserController implements Controller {
  private readonly getCurrentUserUseCase: GetCurrentUser;

  constructor(deps: GetCurrentUserDep) {
    this.getCurrentUserUseCase = deps.getCurrentUserUseCase;
  }

  async handle(request: HttpRequest<{ username: string }>): Promise<HttpResponse> {
    const { username } = request.body;

    try {
      const user = await this.getCurrentUserUseCase.execute(username);

      return {
        statusCode: 200,
        body: user,
      } as HttpResponse<UserDTO>;
    } catch (err: unknown) {
      if (err instanceof UserNotFoundError) {
        return {
          statusCode: 404,
          body: err.message,
        };
      }

      const error = err as Error;
      return {
        statusCode: 500,
        body: { error: error.message || "Erro inesperado." },
      };
    }
  }
}
