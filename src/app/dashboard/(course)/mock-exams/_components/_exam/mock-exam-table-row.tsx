import type { KnowledgeAreaLabelKey, MockExam } from '@/src/web/api';
import { KNOWLEDGE_AREA_LABELS } from '@/src/web/config';

const PERCENTAGE_MULTIPLIER = 100;

type AreaPerformance = MockExam['performances'][KnowledgeAreaLabelKey];
type PerformanceStats = AreaPerformance['statistics'];

type ColumnConfig = {
  key: string;
  className: string;
  getValue: (stats: PerformanceStats) => React.ReactNode;
};

const ROW_COLUMNS: ColumnConfig[] = [
  {
    key: 'correctCount',
    className: 'p-2 font-bold text-(--success)',
    getValue: (stats) => stats.overallResult.correctAnswers,
  },
  {
    key: 'wrongAnswers',
    className: 'p-2 text-(--error)',
    getValue: (stats) => stats.overallResult.wrongAnswers,
  },
  {
    key: 'performanceRate',
    className: 'p-2 font-bold',
    getValue: (stats) =>
      `${(stats.overallResult.performanceRate * PERCENTAGE_MULTIPLIER).toFixed(1)}%`,
  },
  {
    key: 'certaintyCount',
    className: 'p-2 text-(--success) opacity-80',
    getValue: (stats) => stats.qualityAssessment.certaintyHits,
  },
  {
    key: 'confidenceRate',
    className: 'p-2 opacity-70',
    getValue: (stats) =>
      `${(stats.qualityAssessment.confidenceRate * PERCENTAGE_MULTIPLIER).toFixed(1)}%`,
  },
  {
    key: 'doubtHits',
    className: 'p-2 text-(--accent)',
    getValue: (stats) => stats.qualityAssessment.doubtHits,
  },
  {
    key: 'doubtErrors',
    className: 'p-2 text-(--accent) opacity-80',
    getValue: (stats) => stats.qualityAssessment.doubtErrors,
  },
  {
    key: 'criticalErrors',
    className: 'p-2 font-bold text-(--error)',
    getValue: (stats) => stats.qualityAssessment.criticalErrors,
  },
  {
    key: 'distractionErrors',
    className: 'p-2 text-orange-500',
    getValue: (stats) => stats.errorAnalysis.distractionErrors,
  },
  {
    key: 'interpretationErrors',
    className: 'p-2 text-orange-500',
    getValue: (stats) => stats.errorAnalysis.interpretationErrors,
  },
  {
    key: 'knowledgeGapsErrors',
    className: 'p-2 font-bold text-orange-500',
    getValue: (stats) => stats.errorAnalysis.knowledgeGapsErrors,
  },
];

type MockExamTableRowProps = {
  performance: AreaPerformance;
};

export function MockExamTableRow({ performance }: MockExamTableRowProps) {
  const stats = performance.statistics;

  return (
    <tr className="transition-colors hover:bg-(--foreground)/5">
      <td className="p-2 text-left font-sans font-bold opacity-80">
        {KNOWLEDGE_AREA_LABELS[performance.area]}
      </td>
      {ROW_COLUMNS.map((col) => (
        <td
          key={col.key}
          className={col.className}
        >
          {col.getValue(stats)}
        </td>
      ))}
    </tr>
  );
}
