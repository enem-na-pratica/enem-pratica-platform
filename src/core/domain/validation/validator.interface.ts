export interface Validation<T> {
  validate(input: T): void;
}

export type ValidationErrors = Record<string, string[]>;
