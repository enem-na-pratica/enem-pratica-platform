export interface Validation<T> {
  validate(input: unknown): T;
}
