'use client';

import type { CreateMockExamFormValues } from '@/src/web/validation';

import type { useMockExamForm } from './_hooks';
import { AreaPerformanceTable } from './area-performance-table';
import { FormHeaderActions } from './form-header-actions';
import { TitleField } from './title-field';

type MockExamFormProps = {
  form: ReturnType<typeof useMockExamForm>;
  onSubmit: (data: CreateMockExamFormValues) => Promise<void>;
  onReset: () => void;
};

export function MockExamForm({ form, onSubmit, onReset }: MockExamFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    calculatedData,
    calculateTotalInput,
    calculateTotalCalculated,
    totalCorrect,
    globalPerformance,
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card space-y-6 overflow-hidden border-2 border-(--accent) duration-300"
    >
      <FormHeaderActions
        isSubmitting={isSubmitting}
        isValid={isValid}
        onReset={onReset}
      />
      <TitleField
        error={errors.title}
        register={register}
      />
      <AreaPerformanceTable
        calculatedData={calculatedData}
        register={register}
        errors={errors}
        totalCorrect={totalCorrect}
        globalPerformance={globalPerformance}
        calculateTotalInput={calculateTotalInput}
        calculateTotalCalculated={calculateTotalCalculated}
      />
      <FormDisclaimer />
    </form>
  );
}

function FormDisclaimer() {
  return (
    <p className="text-center text-xs italic opacity-50">
      * Campos de preenchimento são obrigatórios. Os demais são calculados
      automaticamente.
    </p>
  );
}
