import type { FieldError, FieldPath, UseFormRegister } from 'react-hook-form';

import type { CreateMockExamFormValues } from '@/src/web/validation';

type AreaInputCellProps = {
  register: UseFormRegister<CreateMockExamFormValues>;
  name: FieldPath<CreateMockExamFormValues>;
  error?: FieldError;
};

export function AreaInputCell({ register, name, error }: AreaInputCellProps) {
  return (
    <div className="group/cell relative w-full">
      <input
        type="number"
        min="0"
        max="45"
        {...register(name, { valueAsNumber: true })}
        onFocus={(e) => e.target.select()}
        className={`h-8 w-full rounded border bg-(--background) text-center font-mono text-sm font-bold transition-all outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) ${
          error
            ? 'animate-shake border-(--error) text-(--error) ring-1 ring-(--error)'
            : 'border-(--foreground)/20'
        }`}
      />
      {error && (
        <div className="absolute -top-1 -right-1 z-20">
          <span className="flex h-3 w-3 cursor-help">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--error) opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-(--error)" />
          </span>
          <div className="animate-in fade-in zoom-in-95 absolute right-0 bottom-full mb-2 hidden duration-200 group-hover/cell:block">
            <div className="rounded bg-(--foreground) px-2 py-1 text-[10px] font-bold whitespace-nowrap text-(--background) shadow-lg">
              {error.message}
              <div className="absolute top-full right-1 border-4 border-transparent border-t-(--foreground)" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
