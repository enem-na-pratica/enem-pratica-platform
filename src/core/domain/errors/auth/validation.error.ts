import { BaseError } from "@/src/core/domain/errors";
import type { FieldErrors } from '@/src/core/domain/contracts';

export class ValidationError extends BaseError {
  public readonly details: FieldErrors;

  constructor(details: FieldErrors) {
    super('Validation failed. See details property for errors.');
    this.name = 'ValidationError';
    this.details = details;
  }
}