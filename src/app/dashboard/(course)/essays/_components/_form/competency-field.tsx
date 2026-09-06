import type {
  FieldError as RHFFieldError,
  UseFormRegister,
} from 'react-hook-form';

import type { CompetencyKey } from '@/src/web/api/modules';
import type { CreateEssayFormValues } from '@/src/web/validation';

type CompetencyFieldProps = {
  name: CompetencyKey;
  error?: RHFFieldError;
  register: UseFormRegister<CreateEssayFormValues>;
};

export function CompetencyField({
  name,
  error,
  register,
}: CompetencyFieldProps) {
  return (
    <div className="relative w-14 sm:w-16">
      <label
        className={`mb-1 block text-center text-[10px] font-bold uppercase transition-colors ${
          error ? 'text-(--error) opacity-100' : 'opacity-60'
        }`}
      >
        {name}
      </label>
      <input
        type="number"
        min="0"
        max="200"
        step="20"
        className={`input p-1 text-center font-mono font-bold transition-all ${
          error
            ? 'animate-shake border-(--error) text-(--error) ring-1 ring-(--error)'
            : ''
        }`}
        {...register(`grades.${name}`, { valueAsNumber: true })}
      />

      {error && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--error) opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-(--error)" />
        </span>
      )}
    </div>
  );
}
