import { CreateUser } from "@/src/core/application/interfaces/user";
import { Validation } from '@/src/core/domain/contracts/validation/validation.interface';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  ErrorResponse
} from '@/src/core/presentation/interfaces';
import { CreateUserDto, UserResDto } from "@/src/core/application/dtos/user";
import * as Http from '@/src/core/presentation/helpers/http.helper';
import { handleError } from '@/src/core/presentation/helpers/error-handler.helper';

export type CreateUserDeps = {
  createUserUseCase: CreateUser;
  createUserValidator: Validation<CreateUserDto>;
}

export class CreateUserController
  implements Controller<CreateUserDto, UserResDto> {
  private readonly createUserUseCase: CreateUser;
  private readonly createUserValidator: Validation<CreateUserDto>;

  constructor(deps: CreateUserDeps) {
    this.createUserUseCase = deps.createUserUseCase;
    this.createUserValidator = deps.createUserValidator;
  }

  async handle(
    request: HttpRequest<CreateUserDto>
  ): Promise<HttpResponse<UserResDto | ErrorResponse>> {
    try {
      const userData = this.createUserValidator.validate(request.body);

      const newUser = await this.createUserUseCase.execute(userData)

      return Http.created(newUser);
    } catch (error) {
      return handleError(error);
    }
  }
}