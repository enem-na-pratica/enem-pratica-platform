import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import type { KnowledgeAreaLabelKey } from '@/src/web/api';
import type { KnowledgeAreaLabelPT } from '@/src/web/config';
import type { CreateMockExamFormValues } from '@/src/web/validation';

import type { AreaCalculatedValues } from './_utils/calculate-area-stats';
import { AreaInputCell } from './area-input-cell';

type AreaPerformanceRowProps = {
  areaKey: KnowledgeAreaLabelKey;
  label: KnowledgeAreaLabelPT;
  stats: AreaCalculatedValues;
  register: UseFormRegister<CreateMockExamFormValues>;
  errors: FieldErrors<CreateMockExamFormValues>;
};

export function AreaPerformanceRow({
  areaKey,
  label,
  stats,
  register,
  errors,
}: AreaPerformanceRowProps) {
  const areaErrors = errors.performances?.[areaKey];
  const cells = buildRowCells(stats);

  return (
    <tr className="transition-colors hover:bg-(--foreground)/5">
      <td className="px-2 py-1 text-left font-bold">{label}</td>
      {cells.map((cell, index) =>
        cell.type === 'input' ? (
          <td
            key={index}
            className="p-1"
          >
            <AreaInputCell
              register={register}
              name={`performances.${areaKey}.${cell.field}`}
              error={areaErrors?.[cell.field]}
            />
          </td>
        ) : (
          <td
            key={index}
            className={`p-1 ${cell.className}`}
          >
            {cell.content}
          </td>
        ),
      )}
    </tr>
  );
}

type InputFieldName =
  | 'correctCount'
  | 'certaintyCount'
  | 'doubtErrors'
  | 'distractionErrors'
  | 'interpretationErrors';

type RowCell =
  | { type: 'input'; field: InputFieldName }
  | { type: 'display'; content: React.ReactNode; className: string };

function buildRowCells(stats: AreaCalculatedValues): RowCell[] {
  return [
    { type: 'input', field: 'correctCount' },
    {
      type: 'display',
      content: stats.wrongAnswers,
      className: 'font-mono font-bold text-(--error)',
    },
    {
      type: 'display',
      content: `${stats.performanceRate.toFixed(0)}%`,
      className: 'text-xs opacity-70',
    },
    { type: 'input', field: 'certaintyCount' },
    {
      type: 'display',
      content: `${stats.confidenceRate.toFixed(0)}%`,
      className: 'text-xs opacity-70',
    },
    {
      type: 'display',
      content: stats.doubtHits,
      className: 'font-mono text-yellow-600 opacity-70 dark:text-yellow-400',
    },
    { type: 'input', field: 'doubtErrors' },
    {
      type: 'display',
      content: stats.criticalErrors,
      className: 'font-mono text-(--error) opacity-50',
    },
    { type: 'input', field: 'distractionErrors' },
    { type: 'input', field: 'interpretationErrors' },
    {
      type: 'display',
      content: stats.knowledgeGaps,
      className: 'font-bold text-orange-600 dark:text-orange-400',
    },
  ];
}
