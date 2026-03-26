import { handleError, noContent } from '@/src/core/presentation/helpers';
import type {
  Controller,
  CookieOptions,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type LogoutControllerDeps = {
  isProduction: boolean;
};

export class LogoutController implements Controller<void, void> {
  private readonly cookieOptions: CookieOptions;

  constructor({ isProduction }: LogoutControllerDeps) {
    this.cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      path: '/',
      sameSite: 'strict',
      maxAge: 0,
      // In most cases, maxAge: 0 is sufficient to invalidate the cookie.
      // If it becomes necessary to use `expires: new Date(0)`,
      // the `CookieOptions` interface will need to be reviewed and updated.
      // expires: new Date(0),
    };
  }

  async handle(): Promise<HttpResponse<void | ErrorResponse>> {
    try {
      return {
        ...noContent(),
        cookies: [
          {
            name: 'auth_token',
            value: '',
            options: this.cookieOptions,
          },
        ],
      };
    } catch (error) {
      return handleError(error);
    }
  }
}
