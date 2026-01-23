import type { TokenPayload } from "./token-payload.type";

// type DecodedToken = TokenPayload & {
//   iat: number;
//   exp: number;
// };

export interface TokenVerifier {
  verify(token: string): TokenPayload;
}