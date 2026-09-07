import type {
  FieldError as RHFFieldError,
  UseFormRegister,
} from 'react-hook-form';

import type { CreateQuestionSessionFormValues } from '@/src/web/validation';

import { FieldError } from './field-error';

type FieldName = 'correct' | 'total';

type NumberFieldProps = {
  name: FieldName;
  label: string;
  error?: RHFFieldError;
  register: UseFormRegister<CreateQuestionSessionFormValues>;
  min?: number;
};

export function NumberField({
  name,
  label,
  error,
  register,
  min = 0,
}: NumberFieldProps) {
  const { borderClass, colorClass, focusClass } = getFieldStyles(name);

  return (
    <div className={'relative w-full sm:w-32'}>
      <label
        className={`mb-1 block text-sm font-bold transition-colors ${
          error ? 'text-(--error)' : colorClass
        }`}
      >
        {label}
      </label>
      <input
        type="number"
        min={min}
        className={`input text-center font-mono font-bold transition-all ${borderClass} ${
          error
            ? 'animate-shake border-(--error) text-(--error) ring-1 ring-(--error)'
            : focusClass
        }`}
        {...register(name, { valueAsNumber: true })}
      />
      <FieldError message={error?.message} />
    </div>
  );
}

function getFieldStyles(name: FieldName) {
  const isCorrect = name === 'correct';

  return {
    colorClass: isCorrect ? 'text-green-500' : 'opacity-70',
    borderClass: isCorrect ? 'border-green-500/40' : '',
    focusClass: isCorrect ? 'focus:border-green-500' : '',
  };
}
