import { useState } from 'react';
import type {
  Validator,
  FieldErrors
} from '@/src/core/domain/contracts/validation';
import { ValidationError } from '@/src/core/domain/errors';

/**
 * @deprecated This hook is deprecated and should no longer be used for new developments.
 * It is maintained only to keep existing forms functional. New forms must use React Hook Form (RHF).
 * Existing forms will be refactored to RHF over time.
 */
export function useValidation<T>(validator: Validator<T>) {
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = (data: T): boolean => {
    try {
      validator.validate(data);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof ValidationError) {
        setErrors(err.details);
      }
      return false;
    }
  };

  const clearErrors = () => setErrors({});

  return { errors, validate, clearErrors };
}