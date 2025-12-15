export interface TokenGenerator<T> {
  generate(payload: T): string;
}
