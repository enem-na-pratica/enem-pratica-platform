import { ZodType } from 'zod';
import {
  Validation,
  ValidationErrors
} from '@/src/core/domain/validation/validator.interface';
import { ValidationError } from '@/src/core/domain/errors/validation.error';

export class ZodValidation<T> implements Validation<T> {
  constructor(private readonly schema: ZodType<T>) { }

  validate(input: T): void {
    const result = this.schema.safeParse(input);

    if (result.success) return;

    const grouped: ValidationErrors = {};

    for (const issue of result.error.issues) {
      const field = issue.path.join('.');
      grouped[field] ??= [];
      grouped[field].push(issue.message);
    }

    throw new ValidationError(grouped);
  }
}
