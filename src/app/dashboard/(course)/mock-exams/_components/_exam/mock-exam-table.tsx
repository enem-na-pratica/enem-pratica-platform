import type { MockExam } from '@/src/web/api';

import { AREA_KEYS, type MockExamTotals } from '../../_utils';
import { COLUMN_TOOLTIPS } from '../constants';
import { MockExamTableRow } from './mock-exam-table-row';
import { MockExamTableTotalRow } from './mock-exam-table-total-row';

type MockExamTableProps = {
  mock: MockExam;
  totals: MockExamTotals;
  globalPerformance: number;
  globalConfidence: number;
};

export function MockExamTable({
  mock,
  totals,
  globalPerformance,
  globalConfidence,
}: MockExamTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-center text-sm">
        <TableHeader />
        <tbody className="divide-y divide-(--foreground)/5 font-mono">
          {AREA_KEYS.map((key) => (
            <MockExamTableRow
              key={key}
              performance={mock.performances[key]}
            />
          ))}
          <MockExamTableTotalRow
            {...totals}
            globalPerformance={globalPerformance}
            globalConfidence={globalConfidence}
          />
        </tbody>
      </table>
    </div>
  );
}

const TABLE_COLUMNS = [
  {
    key: 'correctCount',
    label: 'Acertos',
    className: 'min-w-15 p-2 text-(--success) cursor-help',
  },
  {
    key: 'wrongAnswers',
    label: 'Erros',
    className: 'min-w-15 p-2 text-(--error) cursor-help',
  },
  {
    key: 'performanceRate',
    label: 'Rend.',
    className: 'min-w-20 p-2 cursor-help',
  },
  {
    key: 'certaintyCount',
    label: 'Certeza',
    className: 'min-w-15 p-2 text-(--success) cursor-help',
  },
  {
    key: 'confidenceRate',
    label: 'Confiança',
    className: 'min-w-20 p-2 cursor-help',
  },
  {
    key: 'doubtHits',
    label: 'Dúvida (A)',
    className: 'min-w-15 p-2 text-(--accent) cursor-help',
  },
  {
    key: 'doubtErrors',
    label: 'Dúvida (E)',
    className: 'min-w-15 p-2 text-(--accent) cursor-help',
  },
  {
    key: 'criticalErrors',
    label: 'Falha',
    className: 'min-w-15 p-2 text-(--error) cursor-help',
  },
  {
    key: 'distractionErrors',
    label: 'Distr.',
    className: 'min-w-15 p-2 text-orange-500 cursor-help',
  },
  {
    key: 'interpretationErrors',
    label: 'Interp.',
    className: 'min-w-15 p-2 text-orange-500 cursor-help',
  },
  {
    key: 'knowledgeGapsErrors',
    label: 'Cont.',
    className: 'min-w-15 p-2 text-orange-500 cursor-help',
  },
] as const;

function TableHeader() {
  return (
    <thead>
      <tr className="bg-(--foreground)/5 text-xs font-bold tracking-wider uppercase opacity-70">
        <th className="min-w-25 p-2 text-left">Área</th>
        {TABLE_COLUMNS.map((col) => (
          <th
            key={col.key}
            className={col.className}
            title={COLUMN_TOOLTIPS[col.key]}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
