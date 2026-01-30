import type {
  Controller,
  CookieOptions,
  ErrorResponse,
  HttpResponse
} from '@/src/core/presentation/protocols';
import { handleError, noContent } from '@/src/core/presentation/helpers';

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "strict" as const,
  maxAge: 0,
  // In most cases, maxAge: 0 is sufficient to invalidate the cookie.
  // If it becomes necessary to use `expires: new Date(0)`,
  // the `CookieOptions` interface will need to be reviewed and updated.
  // expires: new Date(0),
};

export class LogoutController implements Controller<void, void> {
  async handle(): Promise<HttpResponse<void | ErrorResponse>> {
    try {
      return {
        ...noContent(),
        cookies: [{
          name: "auth_token",
          value: "",
          options: COOKIE_OPTIONS,
        }]
      };
    } catch (error) {
      return handleError(error);
    }
  }
}