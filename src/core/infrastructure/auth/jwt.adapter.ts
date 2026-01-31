import type {
  TokenGenerator,
  TokenPayload,
  TokenVerifier
} from '@/src/core/domain/contracts/auth';
import type { StringValue } from "ms";
import {
  sign,
  verify,
  JsonWebTokenError as JwtLibError,
  TokenExpiredError as JwtLibExpiredError,
} from "jsonwebtoken";
import { TokenExpiredError, InvalidTokenError } from '@/src/core/domain/errors';

type JwtAdapterDeps = {
  secret: string;
  expiresIn: StringValue | number;
};

type DecodedToken = TokenPayload & {
  iat: number;
  exp: number;
};

export class JwtAdapter implements TokenGenerator, TokenVerifier {
  private readonly secret: string;
  private readonly expiresIn: StringValue | number;

  constructor({ secret, expiresIn }: JwtAdapterDeps) {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  generate(payload: TokenPayload): string {
    return sign(
      payload,
      this.secret,
      { expiresIn: this.expiresIn }
    );
  }

  verify(token: string): TokenPayload {
    try {
      return verify(token, this.secret) as DecodedToken;
    } catch (err: unknown) {
      if (err instanceof JwtLibExpiredError) {
        throw new TokenExpiredError();
      }

      if (err instanceof JwtLibError) {
        throw new InvalidTokenError(err.message);
      }

      const error = err as Error;
      throw error;
    }
  }
}
