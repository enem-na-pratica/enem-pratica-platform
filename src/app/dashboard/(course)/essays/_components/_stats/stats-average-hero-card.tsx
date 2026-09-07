type StatsAverageHeroCardProps = {
  globalAverage: number;
  totalCount: number;
};

export function StatsAverageHeroCard({
  globalAverage,
  totalCount,
}: StatsAverageHeroCardProps) {
  return (
    <div className="card group relative flex flex-col items-center justify-center overflow-hidden bg-(--accent) text-(--foreground) lg:col-span-2">
      <div className="absolute top-0 right-0 rotate-12 p-4 text-6xl opacity-10">
        📊
      </div>
      <span className="text-sm font-bold tracking-widest uppercase opacity-80">
        Média Geral
      </span>
      <strong className="mt-2 text-6xl font-black">
        {globalAverage.toFixed(0)}
      </strong>
      <span className="mt-2 rounded-full bg-black/10 px-3 py-1 text-xs font-medium">
        Baseado em {totalCount} redações
      </span>
    </div>
  );
}
