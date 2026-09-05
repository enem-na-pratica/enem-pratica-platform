import type {
  FieldError as RHFFieldError,
  UseFormRegister,
} from 'react-hook-form';

import type { CreateEssayFormValues } from '@/src/web/validation';

import { FieldError } from './field-error';

type ThemeFieldProps = {
  error?: RHFFieldError;
  register: UseFormRegister<CreateEssayFormValues>;
};

export function ThemeField({ error, register }: ThemeFieldProps) {
  return (
    <div className="group w-full flex-1">
      <label
        className={`mb-1 block text-sm font-bold transition-colors ${
          error ? 'text-(--error)' : 'opacity-70'
        }`}
      >
        Tema da Redação
      </label>
      <input
        type="text"
        placeholder="Ex: Os estigmas associados..."
        className={`input transition-all ${
          error ? 'animate-shake border-(--error) ring-1 ring-(--error)' : ''
        }`}
        {...register('theme')}
      />
      <FieldError message={error?.message} />
    </div>
  );
}
