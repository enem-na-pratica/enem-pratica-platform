export interface Validator<T> {
  validate(input: unknown): T;
}
