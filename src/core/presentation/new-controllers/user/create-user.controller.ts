import type {
  Controller,
  ErrorResponse,
  HttpResponse,
  AuthenticatedRequest
} from '@/src/core/presentation/protocols';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Validator } from '@/src/core/domain/contracts/validation';
import type { CreateUserDto } from '@/src/core/application/use-cases/user';
import type { UserDto } from '@/src/core/application/common/dtos';
import { handleError, created } from '@/src/core/presentation/helpers';

type CreateUserControllerDeps = {
  createUserUseCase: UseCase<CreateUserDto, UserDto>;
  validator: Validator<CreateUserDto>;
}

export class CreateUserController
  implements Controller<CreateUserDto, UserDto> {
  private readonly createUserUseCase: UseCase<CreateUserDto, UserDto>;
  private readonly validator: Validator<CreateUserDto>;

  constructor({ createUserUseCase, validator }: CreateUserControllerDeps) {
    this.createUserUseCase = createUserUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<CreateUserDto>
  ): Promise<HttpResponse<UserDto | ErrorResponse>> {
    try {
      const validatedData = this.validator.validate(request.body);

      const newUser = await this.createUserUseCase.execute(validatedData);

      return created(newUser);
    } catch (error) {
      return handleError(error);
    }
  }
}