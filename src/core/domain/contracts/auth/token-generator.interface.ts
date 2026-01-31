import type { TokenPayload } from "./token-payload.type";

export interface TokenGenerator {
  generate(payload: TokenPayload): string;
}
