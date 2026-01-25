import { BaseError, type ErrorCategory } from "@/src/core/domain/errors";

export class ForbiddenError extends BaseError {
  public category: ErrorCategory = 'FORBIDDEN';

  constructor(
    message: string = 'Access denied. You do not have the necessary permissions for this resource.'
  ) {
    super(message);
  }
}
