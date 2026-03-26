import type { UseCase } from '@/src/core/application/common/interfaces';
import type { LoginDto } from '@/src/core/application/use-cases/auth';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, noContent } from '@/src/core/presentation/helpers';
import type {
  Controller,
  CookieOptions,
  ErrorResponse,
  HttpRequest,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type LoginControllerDeps = {
  loginUseCase: UseCase<LoginDto, string>;
  validator: Validator<LoginDto>;
  isProduction: boolean;
};

export class LoginController implements Controller<LoginDto, void> {
  private readonly loginUseCase: UseCase<LoginDto, string>;
  private readonly validator: Validator<LoginDto>;
  private readonly cookieOptions: CookieOptions;

  constructor({ loginUseCase, validator, isProduction }: LoginControllerDeps) {
    this.loginUseCase = loginUseCase;
    this.validator = validator;

    this.cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
      sameSite: 'strict',
    };
  }

  async handle(
    request: HttpRequest<LoginDto>,
  ): Promise<HttpResponse<void | ErrorResponse>> {
    try {
      const validatedData = this.validator.validate(request.body);

      const accessToken = await this.loginUseCase.execute(validatedData);

      return {
        ...noContent(),
        cookies: [
          {
            name: 'auth_token',
            value: accessToken,
            options: this.cookieOptions,
          },
        ],
      };
    } catch (error) {
      return handleError(error);
    }
  }
}
