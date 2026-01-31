import { BaseError, type ErrorCategory } from "@/src/core/domain/errors";

export class ConflictError extends BaseError {
  public category: ErrorCategory = 'CONFLICT';

  constructor(message: string = 'A conflict occurred with the current state of the resource.') {
    super(message);
  }
}
