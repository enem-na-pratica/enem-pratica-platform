'use client';

import {
  type FieldError,
  type FieldPath,
  type UseFormRegister,
  useForm,
  useWatch,
} from 'react-hook-form';
import toast from 'react-hot-toast';

import { zodResolver } from '@hookform/resolvers/zod';

import type { KnowledgeAreaLabelKey } from '@/src/web/api';
import type { KnowledgeAreaLabelPT } from '@/src/web/config';
import {
  type CreateMockExamFormValues,
  createMockExamSchema,
} from '@/src/web/validation';

import { createMockExamAction } from '../actions';

const TOTAL_QUESTIONS_PER_AREA = 45;
const AREAS: { key: KnowledgeAreaLabelKey; label: KnowledgeAreaLabelPT }[] = [
  { key: 'languages', label: 'Linguagens' },
  { key: 'humanities', label: 'Humanas' },
  { key: 'naturalSciences', label: 'Natureza' },
  { key: 'mathematics', label: 'Matemática' },
];

type AreaInputValues = {
  correctCount: number;
  certaintyCount: number;
  doubtErrors: number;
  distractionErrors: number;
  interpretationErrors: number;
};

type AreaCalculatedValues = {
  wrongAnswers: number;
  performanceRate: number;
  doubtHits: number;
  confidenceRate: number;
  criticalErrors: number;
  knowledgeGaps: number;
};

const DEFAULT_FORM_VALUES: CreateMockExamFormValues = {
  title: '',
  performances: {
    languages: {
      correctCount: 0,
      certaintyCount: 0,
      doubtErrors: 0,
      distractionErrors: 0,
      interpretationErrors: 0,
    },
    humanities: {
      correctCount: 0,
      certaintyCount: 0,
      doubtErrors: 0,
      distractionErrors: 0,
      interpretationErrors: 0,
    },
    naturalSciences: {
      correctCount: 0,
      certaintyCount: 0,
      doubtErrors: 0,
      distractionErrors: 0,
      interpretationErrors: 0,
    },
    mathematics: {
      correctCount: 0,
      certaintyCount: 0,
      doubtErrors: 0,
      distractionErrors: 0,
      interpretationErrors: 0,
    },
  },
};

function calculateAreaStats(input: AreaInputValues): AreaCalculatedValues {
  const {
    correctCount,
    certaintyCount,
    doubtErrors,
    distractionErrors,
    interpretationErrors,
  } = input;

  // Aligned with AreaPerformance entity logic
  const wrongAnswers = TOTAL_QUESTIONS_PER_AREA - correctCount;

  const performanceRate = (correctCount / TOTAL_QUESTIONS_PER_AREA) * 100;

  // doubtHits is now calculated: correct answers that weren't marked with certainty
  const doubtHits = correctCount - certaintyCount;

  const confidenceRate =
    correctCount > 0 ? (certaintyCount / correctCount) * 100 : 0;

  // criticalErrors: wrong answers that weren't due to doubt
  const criticalErrors = Math.max(0, wrongAnswers - doubtErrors);

  // knowledgeGaps: wrong answers not explained by distraction or interpretation
  const knowledgeGaps = Math.max(
    0,
    wrongAnswers - distractionErrors - interpretationErrors,
  );

  return {
    wrongAnswers,
    performanceRate,
    doubtHits,
    confidenceRate,
    criticalErrors,
    knowledgeGaps,
  };
}

type MockExamFormProps = {
  targetUsername: string;
};

/**
 * TODO: Refactor needed
 *
 * Reasons:
 * - Component is too long and hard to scan
 * - Repeated markup for inputs and error handling
 * - Business rules mixed with presentation logic
 * - Difficult to test and maintain
 *
 * This should be split into smaller components and hooks.
 */
export function MockExamForm({ targetUsername }: MockExamFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateMockExamFormValues>({
    mode: 'onChange',
    resolver: zodResolver(createMockExamSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const watchedAreas = useWatch({ control, name: 'performances' });

  const calculatedData = AREAS.reduce(
    (acc, { key }) => {
      acc[key] = calculateAreaStats(watchedAreas[key]);
      return acc;
    },
    {} as Record<KnowledgeAreaLabelKey, AreaCalculatedValues>,
  );

  const calculateTotalInput = (field: keyof AreaInputValues) =>
    AREAS.reduce((sum, { key }) => sum + (watchedAreas[key]?.[field] || 0), 0);

  const calculateTotalCalculated = (field: keyof AreaCalculatedValues) =>
    AREAS.reduce(
      (sum, { key }) => sum + (calculatedData[key]?.[field] || 0),
      0,
    );

  const totalCorrect = calculateTotalInput('correctCount');
  const globalPerformance =
    (totalCorrect / (TOTAL_QUESTIONS_PER_AREA * 4)) * 100;

  const onSubmit = async (data: CreateMockExamFormValues) => {
    try {
      await createMockExamAction({ data, targetUsername });
      toast.success('Simulado salvo com sucesso!');
      reset(DEFAULT_FORM_VALUES);
    } catch {
      toast.error('Erro ao salvar');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card space-y-6 overflow-hidden border-2 border-(--accent) duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-(--foreground)/10 pb-4">
        <h2 className="text-xl font-bold">Novo Simulado</h2>
        <div className="flex items-center gap-4">
          {/* Botão Reset */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Tem certeza que deseja limpar todos os dados?')) {
                reset(DEFAULT_FORM_VALUES);
              }
            }}
            className="text-sm font-medium text-(--foreground)/60 transition-colors hover:text-(--error)"
          >
            Limpar
          </button>

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="button-primary text-sm shadow-(--accent)/20 shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Resultados'}
          </button>
        </div>
      </div>

      {/* Input de Título */}
      <div className="group max-w-md">
        <label
          htmlFor="title"
          className={`mb-1 block text-sm font-bold transition-colors ${
            errors.title
              ? 'text-(--error)'
              : 'opacity-70 group-focus-within:opacity-100'
          }`}
        >
          Título / Instituição
        </label>
        <input
          id="title"
          {...register('title')}
          className={`input text-lg font-bold transition-all outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent) focus:ring-offset-1 ${
            errors.title
              ? 'animate-shake border-(--error) ring-1 ring-(--error) focus:border-(--error) focus:ring-(--error)'
              : ''
          }`}
          placeholder="Ex: Simulado SAS 1º dia"
          autoFocus
        />
        {/* Animated Error Message */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            errors.title ? 'mt-1 max-h-10' : 'max-h-0'
          }`}
        >
          <p className="text-xs font-medium text-(--error) italic">
            {errors.title?.message}
          </p>
        </div>
      </div>

      {/* Tabela de Inputs */}
      <div className="overflow-x-auto rounded-lg border border-(--foreground)/10">
        <table className="w-full text-center text-sm">
          <thead>
            <tr className="h-10 bg-(--foreground)/5 text-[10px] font-bold tracking-wider uppercase">
              <th className="min-w-[120px] px-2 text-left">Área</th>
              <th className="min-w-[60px] bg-(--success)/10 px-1 text-(--success)">
                Acertos*
              </th>
              <th className="min-w-[60px] px-1 text-(--error) opacity-70">
                Erros
              </th>
              <th className="min-w-[60px] px-1 opacity-70">Rend.</th>
              <th className="min-w-[60px] bg-(--success)/10 px-1 text-(--success)">
                Certeza*
              </th>
              <th className="min-w-[60px] px-1 opacity-70">Conf.</th>
              <th className="min-w-[60px] px-1 text-yellow-600 dark:text-yellow-400">
                Dúvida (A)
              </th>
              <th className="min-w-[60px] bg-(--accent)/10 px-1 text-yellow-600 dark:text-yellow-400">
                Dúvida (E)*
              </th>
              <th className="min-w-[60px] px-1 text-(--error) opacity-70">
                Falha
              </th>
              <th className="min-w-[60px] bg-orange-500/10 px-1 text-orange-600 dark:text-orange-400">
                Distr.*
              </th>
              <th className="min-w-[60px] bg-orange-500/10 px-1 text-orange-600 dark:text-orange-400">
                Interp.*
              </th>
              <th className="min-w-[60px] px-1 text-orange-600 opacity-70 dark:text-orange-400">
                Cont.
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--foreground)/5">
            {AREAS.map(({ key, label }) => {
              const stats = calculatedData[key];
              const areaErrors = errors.performances?.[key];

              return (
                <tr
                  key={key}
                  className="transition-colors hover:bg-(--foreground)/5"
                >
                  <td className="px-2 py-1 text-left font-bold">{label}</td>

                  {/* --- INPUTS --- */}
                  <td className="p-1">
                    <RHFInputCell
                      register={register}
                      name={`performances.${key}.correctCount`}
                      error={areaErrors?.correctCount}
                    />
                  </td>

                  {/* --- CALCULADOS --- */}
                  <td className="p-1 font-mono font-bold text-(--error)">
                    {stats.wrongAnswers}
                  </td>
                  <td className="p-1 text-xs opacity-70">
                    {stats.performanceRate.toFixed(0)}%
                  </td>

                  {/* --- INPUTS --- */}
                  <td className="p-1">
                    <RHFInputCell
                      register={register}
                      name={`performances.${key}.certaintyCount`}
                      error={areaErrors?.certaintyCount}
                    />
                  </td>

                  {/* --- CALCULADOS --- */}
                  <td className="p-1 text-xs opacity-70">
                    {stats.confidenceRate.toFixed(0)}%
                  </td>

                  {/* --- CALCULADO (antes era input) --- */}
                  <td className="p-1 font-mono text-yellow-600 opacity-70 dark:text-yellow-400">
                    {stats.doubtHits}
                  </td>

                  {/* --- INPUTS --- */}
                  <td className="p-1">
                    <RHFInputCell
                      register={register}
                      name={`performances.${key}.doubtErrors`}
                      error={areaErrors?.doubtErrors}
                    />
                  </td>

                  {/* --- CALCULADOS --- */}
                  <td className="p-1 font-mono text-(--error) opacity-50">
                    {stats.criticalErrors}
                  </td>

                  {/* --- INPUTS --- */}
                  <td className="p-1">
                    <RHFInputCell
                      register={register}
                      name={`performances.${key}.distractionErrors`}
                      error={areaErrors?.distractionErrors}
                    />
                  </td>
                  <td className="p-1">
                    <RHFInputCell
                      register={register}
                      name={`performances.${key}.interpretationErrors`}
                      error={areaErrors?.interpretationErrors}
                    />
                  </td>

                  {/* --- CALCULADOS --- */}
                  <td className="p-1 font-bold text-orange-600 dark:text-orange-400">
                    {stats.knowledgeGaps}
                  </td>
                </tr>
              );
            })}

            {/* Linha Total */}
            <tr className="border-t-2 border-(--foreground)/20 bg-(--foreground)/10 font-black">
              <td className="px-2 py-3 text-left text-xs uppercase">TOTAL</td>
              <td className="p-1 text-(--success)">{totalCorrect}</td>
              <td className="p-1 text-(--error)">
                {calculateTotalCalculated('wrongAnswers')}
              </td>
              <td className="p-1 text-sm">{globalPerformance.toFixed(0)}%</td>
              <td className="p-1 text-(--success)">
                {calculateTotalInput('certaintyCount')}
              </td>
              <td className="p-1 text-xs opacity-70">
                {totalCorrect > 0
                  ? (
                      (calculateTotalInput('certaintyCount') / totalCorrect) *
                      100
                    ).toFixed(0)
                  : '0'}
                %
              </td>
              <td className="p-1 text-yellow-600 opacity-70 dark:text-yellow-400">
                {calculateTotalCalculated('doubtHits')}
              </td>
              <td className="p-1 text-yellow-600 dark:text-yellow-400">
                {calculateTotalInput('doubtErrors')}
              </td>
              <td className="p-1 text-(--error)">
                {calculateTotalCalculated('criticalErrors')}
              </td>
              <td className="p-1 text-orange-600 dark:text-orange-400">
                {calculateTotalInput('distractionErrors')}
              </td>
              <td className="p-1 text-orange-600 dark:text-orange-400">
                {calculateTotalInput('interpretationErrors')}
              </td>
              <td className="p-1 text-orange-600 dark:text-orange-400">
                {calculateTotalCalculated('knowledgeGaps')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-center text-xs italic opacity-50">
        * Campos de preenchimento são obrigatório. Os demais são calculados
        automaticamente.
      </p>
    </form>
  );
}

function RHFInputCell({
  register,
  name,
  error,
}: {
  register: UseFormRegister<CreateMockExamFormValues>;
  name: FieldPath<CreateMockExamFormValues>;
  error?: FieldError;
}) {
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
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--error) opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-(--error)"></span>
          </span>
          <div className="animate-in fade-in zoom-in-95 absolute right-0 bottom-full mb-2 hidden duration-200 group-hover/cell:block">
            <div className="rounded bg-(--foreground) px-2 py-1 text-[10px] font-bold whitespace-nowrap text-(--background) shadow-lg">
              {error.message}
              <div className="absolute top-full right-1 border-4 border-transparent border-t-(--foreground)"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
