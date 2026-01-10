import { LoginInputDTO } from '@/src/core/application/dtos/auth';
import { Login } from '@/src/core/application/interfaces/auth/login-use-case.interface';
import { IncorrectPasswordError, NotFoundError } from '@/src/core/domain/errors';
import { ValidationError } from '@/src/core/domain/errors';
import { Validation } from '@/src/core/domain/validation/validator.interface';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  CookieOptions,
  ErrorResponse
} from '@/src/core/presentation/interfaces';

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7, // 7 dias
  path: "/",
  sameSite: "strict",
};

export type LoginDep = {
  loginUseCase: Login;
  loginValidator: Validation<LoginInputDTO>;
}

export class LoginController
  implements Controller<LoginInputDTO, null> {
  private readonly loginUseCase: Login;
  private readonly loginValidator: Validation<LoginInputDTO>;

  constructor(deps: LoginDep) {
    this.loginUseCase = deps.loginUseCase;
    this.loginValidator = deps.loginValidator;
  }

  async handle(
    request: HttpRequest<LoginInputDTO>
  ): Promise<HttpResponse<null | ErrorResponse>> {
    try {
      const { username, password } = request.body;

      this.loginValidator.validate(request.body);

      const accessToken = await this.loginUseCase.execute({ username, password });

      return {
        statusCode: 204,
        body: null,
        cookies: [{
          name: "auth_token",
          value: accessToken,
          options: COOKIE_OPTIONS,
        }]
      };
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        return {
          statusCode: 400,
          body: { message: err.message, details: err.details },
        };
      }

      if (err instanceof IncorrectPasswordError) {
        return {
          statusCode: 403,
          body: { message: err.message },
        };
      }

      if (err instanceof NotFoundError) {
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