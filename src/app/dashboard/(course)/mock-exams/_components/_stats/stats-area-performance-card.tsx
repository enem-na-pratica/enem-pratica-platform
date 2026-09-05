import type { KnowledgeAreaLabelKey, MockExamStatistics } from '@/src/web/api';

import { getPerformanceBarColor } from '../../_utils';

const AREA_LABELS: Record<KnowledgeAreaLabelKey, string> = {
  languages: 'LIN',
  humanities: 'HUM',
  naturalSciences: 'NAT',
  mathematics: 'MAT',
};

const PERCENTAGE_MULTIPLIER = 100;

type StatsAreaPerformanceCardProps = {
  performancePerArea: MockExamStatistics['performancePerArea'];
};

export function StatsAreaPerformanceCard({
  performancePerArea,
}: StatsAreaPerformanceCardProps) {
  return (
    <div className="card flex flex-col justify-between p-5 lg:col-span-2">
      <h3 className="mb-3 text-xs font-bold uppercase opacity-60">
        Desempenho por Área
      </h3>
      <div className="space-y-3">
        {(Object.keys(performancePerArea) as KnowledgeAreaLabelKey[]).map(
          (key) => (
            <PerformanceAreaRow
              key={key}
              areaKey={key}
              data={performancePerArea[key]}
            />
          ),
        )}
      </div>
    </div>
  );
}

function PerformanceAreaRow({
  areaKey,
  data,
}: {
  areaKey: KnowledgeAreaLabelKey;
  data: MockExamStatistics['performancePerArea'][KnowledgeAreaLabelKey];
}) {
  const rate = data.averagePerformanceRate * PERCENTAGE_MULTIPLIER;
  const { bgBarColor, textBarColor } = getPerformanceTheme(rate);

  return (
    <div className="flex items-center gap-3">
      <span className="w-8 font-mono text-[10px] font-bold uppercase opacity-50">
        {AREA_LABELS[areaKey]}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-(--foreground)/10">
        <div
          className={`h-full transition-all duration-1000 ${bgBarColor}`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span className={`w-10 text-right text-xs font-bold ${textBarColor}`}>
        {rate.toFixed(0)}%
      </span>
    </div>
  );
}

function getPerformanceTheme(averagePerformanceRate: number) {
  const barColor = getPerformanceBarColor(averagePerformanceRate);
  const bgBarColor = `bg-[var(${barColor})]`;
  const textBarColor = `text-[var(${barColor})]`;

  return { barColor, bgBarColor, textBarColor };
}
