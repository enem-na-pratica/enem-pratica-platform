import { useState } from 'react';
import { Validation, ValidationErrors } from '@/src/core/domain/contracts/validation/validation.interface';
import { ValidationError } from '@/src/core/domain/errors';

export function useValidation<T>(validator: Validation<T>) {
  const [errors, setErrors] = useState<ValidationErrors>({});

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