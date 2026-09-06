'use client';

import { FormSubmitButton } from '@/src/web/components';
import type { CreateEssayFormValues } from '@/src/web/validation';

import type { useEssayForm } from './_hooks';
import { CompetencyGrid } from './competency-grid';
import { ThemeField } from './theme-field';

type EssayFormProps = {
  form: ReturnType<typeof useEssayForm>;
  onSubmit: (data: CreateEssayFormValues) => Promise<void>;
};

export function EssayForm({ form, onSubmit }: EssayFormProps) {
  const { errors, isSubmitting, isValid } = form.formState;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="card animate-in zoom-in-95 overflow-hidden border-2 border-(--accent) duration-300"
    >
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end">
        <ThemeField
          error={errors.theme}
          register={form.register}
        />
        <CompetencyGrid
          errors={errors.grades}
          register={form.register}
        />

        <FormSubmitButton
          isSubmitting={isSubmitting}
          isValid={isValid}
        />
      </div>

      {errors.grades && (
        <div className="animate-in fade-in slide-in-from-top-1 mt-4 rounded-lg border border-(--error)/20 bg-(--error)/10 p-2">
          <p className="text-center text-[11px] font-bold tracking-wider text-(--error) uppercase">
            As notas devem estar entre 0 e 200 e ser múltiplos de 20.
          </p>
        </div>
      )}
    </form>
  );
}
