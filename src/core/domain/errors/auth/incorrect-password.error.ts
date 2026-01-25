import { BaseError, type ErrorCategory } from "@/src/core/domain/errors";

export class IncorrectPasswordError extends BaseError {
  public category: ErrorCategory = 'UNAUTHORIZED';

  constructor() {
    super("Incorrect password");
  }
}
