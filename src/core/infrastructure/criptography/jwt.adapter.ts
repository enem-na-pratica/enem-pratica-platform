import { sign, verify } from "jsonwebtoken";
import { TokenGenerator, TokenValidator } from "@/src/core/domain/auth";
import { StringValue } from "ms";

export class JwtTokenAdapter<T extends object>
  implements TokenGenerator<T>, TokenValidator<T> {

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

  validate(token: string): T {
    try {
      return verify(token, this.secret) as T;
    } catch {
      // TODO: Implementar erro personalizado
      throw new Error("InvalidTokenError");
    }
  }
}
