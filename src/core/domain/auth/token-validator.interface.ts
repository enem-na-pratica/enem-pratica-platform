export interface TokenValidator<T> {
  validate(token: string): T;
}
