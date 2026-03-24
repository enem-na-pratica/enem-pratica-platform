'use client';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { zodResolver } from '@hookform/resolvers/zod';

import { CompetencyKey } from '@/src/web/api/modules';
import { CreateEssayFormValues, createEssaySchema } from '@/src/web/validation';

import { createEssayAction } from '../actions';

const COMPETENCIES: CompetencyKey[] = ['c1', 'c2', 'c3', 'c4', 'c5'];

type EssayFormProps = {
  targetUsername: string;
};
export function EssayForm({ targetUsername }: EssayFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateEssayFormValues>({
    resolver: zodResolver(createEssaySchema),
    mode: 'onChange',
    defaultValues: {
      theme: '',
      grades: {
        c1: 120,
        c2: 120,
        c3: 120,
        c4: 120,
        c5: 120,
      },
    },
  });

  const onSubmit = async (data: CreateEssayFormValues) => {
    try {
      await createEssayAction({ data, targetUsername });

      toast.success('Redação salva com sucesso!');

      reset({
        theme: '',
        grades: { c1: 120, c2: 120, c3: 120, c4: 120, c5: 120 },
      });
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar redação.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card animate-in zoom-in-95 overflow-hidden border-2 border-(--accent) duration-300"
    >
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end">
        {/* Theme field */}
        <div className="group w-full flex-1">
          <label
            className={`mb-1 block text-sm font-bold transition-colors ${
              errors.theme ? 'text-(--error)' : 'opacity-70'
            }`}
          >
            Tema da Redação
          </label>
          <input
            type="text"
            placeholder="Ex: Os estigmas associados..."
            className={`input transition-all ${
              errors.theme
                ? 'animate-shake border-(--error) ring-1 ring-(--error)'
                : ''
            }`}
            {...register('theme')}
          />
          {/* Theme Error */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              errors.theme ? 'mt-1 max-h-10' : 'max-h-0'
            }`}
          >
            <p className="text-xs font-medium text-(--error) italic">
              {errors.theme?.message}
            </p>
          </div>
        </div>

        {/* Competency Grid */}
        <div className="flex w-full flex-wrap items-end gap-4 sm:flex-nowrap lg:w-auto">
          <div className="flex gap-2">
            {COMPETENCIES.map((key) => {
              const fieldError = errors.grades?.[key];

              return (
                <div
                  key={key}
                  className="relative w-14 sm:w-16"
                >
                  <label
                    className={`mb-1 block text-center text-[10px] font-bold uppercase transition-colors ${
                      fieldError ? 'text-(--error) opacity-100' : 'opacity-60'
                    }`}
                  >
                    {key}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    step="20"
                    className={`input p-1 text-center font-mono font-bold transition-all ${
                      fieldError
                        ? 'animate-shake border-(--error) text-(--error) ring-1 ring-(--error)'
                        : ''
                    } `}
                    {...register(`grades.${key}`, { valueAsNumber: true })}
                  />

                  {/* Floating Error Indicator (Tooltip-like) */}
                  {fieldError && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--error) opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-(--error)"></span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="button-primary h-[42px] w-full whitespace-nowrap transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      {/* Global Error Message for Skills */}
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
