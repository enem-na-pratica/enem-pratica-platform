import type {
  FieldError as RHFFieldError,
  UseFormRegister,
} from 'react-hook-form';

import type { CreateMockExamFormValues } from '@/src/web/validation';

import { FieldError } from './field-error';

type TitleFieldProps = {
  error?: RHFFieldError;
  register: UseFormRegister<CreateMockExamFormValues>;
};

export function TitleField({ error, register }: TitleFieldProps) {
  return (
    <div className="group max-w-md">
      <label
        htmlFor="title"
        className={`mb-1 block text-sm font-bold transition-colors ${
          error ? 'text-(--error)' : 'opacity-70 group-focus-within:opacity-100'
        }`}
      >
        Título / Instituição
      </label>
      <input
        id="title"
        {...register('title')}
        className={`input text-lg font-bold transition-all outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent) focus:ring-offset-1 ${
          error
            ? 'animate-shake border-(--error) ring-1 ring-(--error) focus:border-(--error) focus:ring-(--error)'
            : ''
        }`}
        placeholder="Ex: Simulado SAS 1º dia"
        autoFocus
      />
      <FieldError message={error?.message} />
    </div>
  );
}
