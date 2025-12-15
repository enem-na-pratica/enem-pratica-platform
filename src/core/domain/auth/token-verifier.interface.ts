export interface TokenVerifier<T> {
  verify(token: string): T;
}
