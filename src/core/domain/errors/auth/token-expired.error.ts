import { BaseError, type ErrorCategory } from "@/src/core/domain/errors";

export class TokenExpiredError extends BaseError {
  public category: ErrorCategory = 'UNAUTHORIZED';

  constructor(
    message: string = 'The authentication token has expired. Please login again.'
  ) {
    super(message);
  }
}