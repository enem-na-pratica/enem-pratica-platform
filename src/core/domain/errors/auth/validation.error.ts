import { BaseError } from "@/src/core/domain/errors";
import { ValidationErrors } from '@/src/core/domain/validation/validator.interface';

export class ValidationError extends BaseError {
  public readonly details: ValidationErrors;

  constructor(details: ValidationErrors) {
    super('Validation failed. See details property for errors.');
    this.name = 'ValidationError';
    this.details = details;
  }
}