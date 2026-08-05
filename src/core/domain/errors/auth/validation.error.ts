import type { FieldErrors } from '@/src/core/domain/contracts';
import { BaseError, type ErrorCategory } from '@/src/core/domain/errors';

export class ValidationError extends BaseError {
  public category: ErrorCategory = 'VALIDATION';
  public readonly details: FieldErrors;

  constructor(details: FieldErrors) {
    super('Validation failed. See details property for errors.');
    this.name = 'ValidationError';
    this.details = details;
  }
}
