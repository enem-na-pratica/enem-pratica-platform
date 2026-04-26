import type { UserDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type GetAuthenticatedUserControllerDeps = {
  getAuthenticatedUserUseCase: UseCase<string, UserDto>;
};

export class GetAuthenticatedUserController implements Controller<
  void,
  UserDto
> {
  private readonly getAuthenticatedUserUseCase: UseCase<string, UserDto>;

  constructor({
    getAuthenticatedUserUseCase,
  }: GetAuthenticatedUserControllerDeps) {
    this.getAuthenticatedUserUseCase = getAuthenticatedUserUseCase;
  }

  async handle(
    request: AuthenticatedRequest<void>,
  ): Promise<HttpResponse<UserDto | ErrorResponse>> {
    try {
      const requesterData = await this.getAuthenticatedUserUseCase.execute(
        request.requester.id,
      );

      return ok(requesterData);
    } catch (error) {
      return handleError(error);
    }
  }
}
