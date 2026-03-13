import type { ZodType } from 'zod';

import type {
  FieldErrors,
  Validator,
} from '@/src/core/domain/contracts/validation';
import { ValidationError } from '@/src/core/domain/errors';

/**
 * {@link Validator} backed by a Zod schema.
 *
 * All field errors are collected and thrown together as a single
 * {@link ValidationError} — callers receive every problem at once.
 */
export class ZodValidator<TOutput> implements Validator<TOutput> {
  constructor(private readonly schema: ZodType<TOutput>) {}

  validate(input: unknown): TOutput {
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
