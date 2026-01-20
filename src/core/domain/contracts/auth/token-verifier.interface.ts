import type { TokenPayload } from "./token-payload.type";

export interface TokenVerifier {
  verify(token: string): TokenPayload;
}