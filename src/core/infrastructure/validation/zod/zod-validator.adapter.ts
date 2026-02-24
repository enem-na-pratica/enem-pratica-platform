import type { ZodType } from 'zod';

import type {
  FieldErrors,
  Validator,
} from '@/src/core/domain/contracts/validation';
import { ValidationError } from '@/src/core/domain/errors';

export class ZodValidator<T> implements Validator<T> {
  constructor(private readonly schema: ZodType<T>) {}

  validate(input: T): T {
    const result = this.schema.safeParse(input);

    if (result.success) return result.data;

    const grouped: FieldErrors = {};

    for (const issue of result.error.issues) {
      const field = issue.path.join('.');
      grouped[field] ??= [];
      grouped[field].push(issue.message);
    }

    throw new ValidationError(grouped);
  }
}
