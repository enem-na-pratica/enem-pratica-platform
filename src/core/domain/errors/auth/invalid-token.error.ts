import { BaseError, type ErrorCategory } from "@/src/core/domain/errors";

export class InvalidTokenError extends BaseError {
  public category: ErrorCategory = 'UNAUTHORIZED';

  constructor(message: string = 'The authentication token is invalid.') {
    super(message);
  }
}