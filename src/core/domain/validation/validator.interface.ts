export interface Validation<T> {
  validate(input: T): T;
}

export type ValidationErrors = Record<string, string[]>;
