import { LoginInputDTO } from '@/src/core/application/dtos/auth';
import { UserDTO } from "@/src/core/application/dtos/user";
import { Login } from '@/src/core/application/interfaces/auth/login-use-case.interface';
import { NotFoundError } from '@/src/core/domain/errors';
import { ValidationError } from '@/src/core/domain/errors/validation.error';
import { Validation } from '@/src/core/domain/validation/validator.interface';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  CookieOptions
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
        body: result.user,
        cookies: [{
          name: "auth_token",
          value: result.accessToken,
          options: COOKIE_OPTIONS,
        }]
      } as HttpResponse<UserDTO>;
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        return {
          statusCode: 400,
          body: err.details,
        };
      }

      if (err instanceof NotFoundError) {
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