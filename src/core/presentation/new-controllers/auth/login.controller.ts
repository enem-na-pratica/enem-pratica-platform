import type {
  Controller,
  CookieOptions,
  ErrorResponse,
  HttpRequest,
  HttpResponse
} from '@/src/core/presentation/protocols';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type { LoginDto } from '@/src/core/application/use-cases/auth';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, noContent } from '@/src/core/presentation/helpers';

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7, // 7 dias
  path: "/",
  sameSite: "strict",
};

export type LoginControllerDeps = {
  loginUseCase: UseCase<LoginDto, string>;
  validator: Validator<LoginDto>;
}

export class LoginController
  implements Controller<LoginDto, null> {
  private readonly loginUseCase: UseCase<LoginDto, string>;
  private readonly validator: Validator<LoginDto>;

  constructor({ loginUseCase, validator }: LoginControllerDeps) {
    this.loginUseCase = loginUseCase;
    this.validator = validator;
  }

  async handle(
    request: HttpRequest<LoginDto>
  ): Promise<HttpResponse<null | ErrorResponse>> {
    try {
      const validatedData = this.validator.validate(request.body);

      const accessToken = await this.loginUseCase.execute(validatedData);

      return {
        ...noContent(),
        cookies: [{
          name: "auth_token",
          value: accessToken,
          options: COOKIE_OPTIONS,
        }]
      };
    } catch (error) {
      return handleError(error);
    }
  }
}