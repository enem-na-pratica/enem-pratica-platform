import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import type { KnowledgeAreaLabelKey } from '@/src/web/api';
import type { CreateMockExamFormValues } from '@/src/web/validation';

import type {
  AreaCalculatedValues,
  AreaInputValues,
} from './_utils/calculate-area-stats';
import { AreaPerformanceRow } from './area-performance-row';
import { AreaPerformanceTotalsRow } from './area-performance-totals-row';
import { AREAS } from './constants';

type AreaPerformanceTableProps = {
  calculatedData: Record<KnowledgeAreaLabelKey, AreaCalculatedValues>;
  register: UseFormRegister<CreateMockExamFormValues>;
  errors: FieldErrors<CreateMockExamFormValues>;
  totalCorrect: number;
  globalPerformance: number;
  calculateTotalInput: (field: keyof AreaInputValues) => number;
  calculateTotalCalculated: (field: keyof AreaCalculatedValues) => number;
};

export function AreaPerformanceTable({
  calculatedData,
  register,
  errors,
  totalCorrect,
  globalPerformance,
  calculateTotalInput,
  calculateTotalCalculated,
}: AreaPerformanceTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-(--foreground)/10">
      <table className="w-full text-center text-sm">
        <TableHead />
        <tbody className="divide-y divide-(--foreground)/5">
          {AREAS.map(({ key, label }) => (
            <AreaPerformanceRow
              key={key}
              areaKey={key}
              label={label}
              stats={calculatedData[key]}
              register={register}
              errors={errors}
            />
          ))}

          <AreaPerformanceTotalsRow
            totalCorrect={totalCorrect}
            globalPerformance={globalPerformance}
            calculateTotalInput={calculateTotalInput}
            calculateTotalCalculated={calculateTotalCalculated}
          />
        </tbody>
      </table>
    </div>
  );
}

const COLUMN_TOOLTIPS = {
  correctCount: 'Quantidade de questões respondidas corretamente.',
  wrongAnswers: 'Quantidade total de questões respondidas incorretamente.',
  performanceRate:
    'Percentual de acertos sobre o total de questões respondidas.',
  certaintyCount: 'Acertos em questões que você marcou como tendo certeza.',
  confidenceRate:
    'Percentual de acertos entre as questões respondidas com certeza.',
  doubtHits: 'Acertos em questões que você respondeu com dúvida.',
  doubtErrors: 'Erros em questões que você respondeu com dúvida.',
  criticalErrors:
    'Erros em questões respondidas com confiança, sem indicação de dúvida.',
  distractionErrors: 'Erros causados por distração ou falta de atenção.',
  interpretationErrors:
    'Erros causados por interpretação incorreta da questão.',
  knowledgeGapsErrors: 'Erros causados por falta de conhecimento do conteúdo.',
} as const;

const TABLE_COLUMNS = [
  {
    key: 'correctCount',
    label: 'Acertos*',
    className: 'bg-(--success)/10 text-(--success) cursor-help',
  },
  {
    key: 'wrongAnswers',
    label: 'Erros',
    className: 'text-(--error) opacity-70 cursor-help',
  },
  {
    key: 'performanceRate',
    label: 'Rend.',
    className: 'opacity-70 cursor-help',
  },
  {
    key: 'certaintyCount',
    label: 'Certeza.',
    className: 'bg-(--success)/10 text-(--success) cursor-help',
  },
  {
    key: 'confidenceRate',
    label: 'Conf.',
    className: 'opacity-70 cursor-help',
  },
  {
    key: 'doubtHits',
    label: 'Dúvida (A)',
    className: 'text-yellow-600 dark:text-yellow-400 cursor-help',
  },
  {
    key: 'doubtErrors',
    label: 'Dúvida (E)*',
    className:
      'bg-(--accent)/10 text-yellow-600 dark:text-yellow-400 cursor-help',
  },
  {
    key: 'criticalErrors',
    label: 'Falha.',
    className: 'text-(--error) opacity-70 cursor-help',
  },
  {
    key: 'distractionErrors',
    label: 'Distr.*',
    className:
      'bg-orange-500/10 text-orange-600 dark:text-orange-400 cursor-help',
  },
  {
    key: 'interpretationErrors',
    label: 'Interp.*',
    className:
      'bg-orange-500/10 text-orange-600 dark:text-orange-400 cursor-help',
  },
  {
    key: 'knowledgeGapsErrors',
    label: 'Cont.',
    className: 'text-orange-600 opacity-70 dark:text-orange-400 cursor-help',
  },
] as const;

function TableHead() {
  return (
    <thead>
      <tr className="h-10 bg-(--foreground)/5 text-[10px] font-bold tracking-wider uppercase">
        <th className="min-w-[120px] px-2 text-left">Área</th>
        {TABLE_COLUMNS.map((col) => (
          <th
            key={col.key}
            className={`min-w-[60px] px-1 ${col.className}`}
            title={COLUMN_TOOLTIPS[col.key]}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
