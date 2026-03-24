import type { KnowledgeAreaLabelKey, MockExamStatistics } from '@/src/web/api';

const AREA_LABELS: Record<KnowledgeAreaLabelKey, string> = {
  languages: 'LIN',
  humanities: 'HUM',
  naturalSciences: 'NAT',
  mathematics: 'MAT',
};

const RATE_THRESHOLDS = [
  { max: 60, color: 'hsl(0, 84%, 60%)' }, // Insufficient
  { max: 75, color: 'hsl(35, 90%, 55%)' }, // Regular/Medium
  { max: 85, color: 'hsl(50, 90%, 50%)' }, // Decent
  { max: 90, color: 'hsl(100, 70%, 45%)' }, // Very Good
  { max: Infinity, color: 'hsl(130, 70%, 40%)' }, // Excellent
];

const ERROR_THRESHOLDS = [
  { max: 3, color: 'text-emerald-500' }, // Excellent
  { max: 8, color: 'text-lime-500' }, // Very Good
  { max: 15, color: 'text-yellow-500' }, // Attention
  { max: 25, color: 'text-orange-500' }, // Concerning
  { max: Infinity, color: 'text-red-500' }, // Critical (collapse zone)
];

const PERCENTAGE_MULTIPLIER = 100;

export function MockStatsSection({ stats }: { stats: MockExamStatistics }) {
  function getBarColor(rate: number) {
    return RATE_THRESHOLDS.find((t) => rate <= t.max)!.color;
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-4 duration-500 md:grid-cols-2 lg:grid-cols-4">
      {/* Overall Average Income */}
      <div className="card relative flex flex-col items-center justify-center overflow-hidden lg:col-span-1">
        <div className="absolute top-0 right-0 p-4 text-6xl opacity-10 grayscale">
          📈
        </div>
        <span className="text-xs font-bold tracking-widest uppercase opacity-60">
          Rendimento Global
        </span>
        <strong className="mt-2 text-5xl font-black text-(--accent)">
          {(stats.globalAveragePerformance * PERCENTAGE_MULTIPLIER).toFixed(1)}%
        </strong>
        <span className="mt-2 text-[10px] font-bold uppercase opacity-40">
          Média de Acertos
        </span>
      </div>

      {/* Area Bar Chart */}
      <div className="card flex flex-col justify-between p-5 lg:col-span-2">
        <h3 className="mb-3 text-xs font-bold uppercase opacity-60">
          Desempenho por Área
        </h3>
        <div className="space-y-3">
          {(
            Object.keys(stats.performancePerArea) as KnowledgeAreaLabelKey[]
          ).map((key) => {
            const averagePerformanceRate =
              stats.performancePerArea[key].averagePerformanceRate *
              PERCENTAGE_MULTIPLIER;
            const barColor = getBarColor(averagePerformanceRate);

            return (
              <div
                key={key}
                className="flex items-center gap-3"
              >
                <span className="w-8 font-mono text-[10px] font-bold uppercase opacity-50">
                  {AREA_LABELS[key]}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-(--foreground)/10">
                  <div
                    className="h-full transition-all duration-1000"
                    style={{
                      width: `${averagePerformanceRate}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
                <span
                  className="w-10 text-right text-xs font-bold"
                  style={{ color: barColor }}
                >
                  {averagePerformanceRate.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Analysis (Prevalence) */}
      <div className="card flex flex-col p-5 lg:col-span-1">
        <h3 className="mb-3 text-xs font-bold uppercase opacity-60">
          Raio-X dos Erros
        </h3>
        <div className="flex flex-1 flex-col justify-center gap-4">
          <ErrorMetric
            label="Conteúdo"
            value={stats.errorPrevalence.knowledgeGapAverage}
          />
          <ErrorMetric
            label="Distração"
            value={stats.errorPrevalence.distractionAverage}
          />
          <ErrorMetric
            label="Interpretação"
            value={stats.errorPrevalence.interpretationAverage}
          />
        </div>
      </div>
    </section>
  );
}

function ErrorMetric({ label, value }: { label: string; value: number }) {
  function getErrorColor(value: number) {
    return ERROR_THRESHOLDS.find((t) => value <= t.max)!.color;
  }

  return (
    <div className="flex items-center justify-between border-b border-(--foreground)/5 pb-2">
      <span className="text-sm font-medium opacity-80">{label}</span>
      <span className={`font-mono font-bold ${getErrorColor(value)}`}>
        ~{value.toFixed(1)}
      </span>
    </div>
  );
}
