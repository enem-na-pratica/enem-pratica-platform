const PERCENTAGE_MULTIPLIER = 100;

type StatsGlobalPerformanceCardProps = {
  globalAveragePerformance: number;
};

export function StatsGlobalPerformanceCard({
  globalAveragePerformance,
}: StatsGlobalPerformanceCardProps) {
  return (
    <div className="card relative flex flex-col items-center justify-center overflow-hidden lg:col-span-1">
      <div className="absolute top-0 right-0 p-4 text-6xl opacity-10 grayscale">
        📈
      </div>
      <span className="text-xs font-bold tracking-widest uppercase opacity-60">
        Rendimento Global
      </span>
      <strong className="mt-2 text-5xl font-black text-(--accent)">
        {(globalAveragePerformance * PERCENTAGE_MULTIPLIER).toFixed(1)}%
      </strong>
      <span className="mt-2 text-[10px] font-bold uppercase opacity-40">
        Média de Acertos
      </span>
    </div>
  );
}
