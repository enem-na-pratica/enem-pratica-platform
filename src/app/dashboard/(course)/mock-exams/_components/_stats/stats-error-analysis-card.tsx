import type { MockExamStatistics } from '@/src/web/api';

import { getErrorSeverityColor } from '../../_utils';

type StatsErrorAnalysisCardProps = {
  errorPrevalence: MockExamStatistics['errorPrevalence'];
};

export function StatsErrorAnalysisCard({
  errorPrevalence,
}: StatsErrorAnalysisCardProps) {
  return (
    <div className="card flex flex-col p-5 lg:col-span-1">
      <h3 className="mb-3 text-xs font-bold uppercase opacity-60">
        Raio-X dos Erros
      </h3>
      <div className="flex flex-1 flex-col justify-center gap-4">
        <ErrorMetric
          label="Conteúdo"
          value={errorPrevalence.knowledgeGapAverage}
        />
        <ErrorMetric
          label="Distração"
          value={errorPrevalence.distractionAverage}
        />
        <ErrorMetric
          label="Interpretação"
          value={errorPrevalence.interpretationAverage}
        />
      </div>
    </div>
  );
}

function ErrorMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between border-b border-(--foreground)/5 pb-2">
      <span className="text-sm font-medium opacity-80">{label}</span>
      <span className={`font-mono font-bold ${getErrorSeverityColor(value)}`}>
        ~{value.toFixed(1)}
      </span>
    </div>
  );
}
