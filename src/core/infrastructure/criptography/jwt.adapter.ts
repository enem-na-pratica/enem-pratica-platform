import {
  sign,
  verify,
  JsonWebTokenError as JwtLibError,
  TokenExpiredError as JwtLibExpiredError,
} from "jsonwebtoken";
import { TokenGenerator, TokenVerifier } from "@/src/core/domain/auth";
import { StringValue } from "ms";
import { TokenExpiredError, InvalidTokenError } from "@/src/core/domain/errors";

export class JwtTokenAdapter<T extends object>
  implements TokenGenerator<T>, TokenVerifier<T> {

  constructor(
    private readonly secret: string,
    private readonly expiresIn: StringValue | number
  ) { }

  generate(payload: T): string {
    return sign(
      payload,
      this.secret,
      { expiresIn: this.expiresIn }
    );
  }

  verify(token: string): T {
    try {
      return verify(token, this.secret) as T;
    } catch (err: unknown) {
      const error = err as Error;

      if (error instanceof JwtLibExpiredError) {
        throw new TokenExpiredError();
      }

      if (error instanceof JwtLibError) {
        throw new InvalidTokenError(error.message);
      }

      throw error;
    }
  }
}
