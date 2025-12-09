import { LoginInputDTO, LoginOutputDTO } from '@/src/core/application/dtos/auth';
import { Login } from '@/src/core/application/interfaces/auth/login-use-case.interface';
import { ValidationError } from '@/src/core/domain/errors/validation.error';
import { Validation } from '@/src/core/domain/validation/validator.interface';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/src/core/presentation/interfaces';

export type LoginDep = {
  loginUseCase: Login;
  loginValidator: Validation<LoginInputDTO>;
}

export class LoginController implements Controller {
  private readonly loginUseCase: Login;
  private readonly loginValidator: Validation<LoginInputDTO>;

  constructor(deps: LoginDep) {
    this.loginUseCase = deps.loginUseCase;
    this.loginValidator = deps.loginValidator;
  }

  async handle(
    request: HttpRequest<LoginInputDTO>
  ): Promise<HttpResponse> {
    try {
      const { username, password } = request.body;

      this.loginValidator.validate(request.body);

      const result = await this.loginUseCase.execute({ username, password });

      return {
        statusCode: 200,
        body: result,
      } as HttpResponse<LoginOutputDTO>;
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        return {
          statusCode: 400,
          body: err.details,
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