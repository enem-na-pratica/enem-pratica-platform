import type {
  FieldError as RHFFieldError,
  UseFormRegister,
} from 'react-hook-form';

import type { CreateQuestionSessionFormValues } from '@/src/web/validation';

import { FieldError } from './field-error';

type DateFieldProps = {
  today: string;
  error?: RHFFieldError;
  register: UseFormRegister<CreateQuestionSessionFormValues>;
};

export function DateField({ today, error, register }: DateFieldProps) {
  return (
    <div className="w-full lg:w-48">
      <label
        className={`mb-1 block text-sm font-bold transition-colors ${
          error ? 'text-(--error)' : 'opacity-70'
        }`}
      >
        Data
      </label>
      <input
        type="date"
        max={today}
        className={`input transition-all ${
          error ? 'animate-shake border-(--error) ring-1 ring-(--error)' : ''
        }`}
        {...register('date')}
      />
      <FieldError message={error?.message} />
    </div>
  );
}
