const PERCENTAGE_MULTIPLIER = 100;

type StatsAccuracyHeroCardProps = {
  overallAccuracy: number;
  totalCorrect: number;
  totalQuestions: number;
};

export function StatsAccuracyHeroCard({
  overallAccuracy,
  totalCorrect,
  totalQuestions,
}: StatsAccuracyHeroCardProps) {
  return (
    <div className="card group relative flex flex-col items-center justify-center overflow-hidden bg-(--accent) text-(--foreground) lg:col-span-2">
      <div className="absolute top-0 right-0 rotate-12 p-4 text-6xl opacity-10">
        🎯
      </div>
      <span className="text-sm font-bold tracking-widest uppercase opacity-80">
        Taxa de Acertos
      </span>
      <strong className="mt-2 text-6xl font-black">
        {(overallAccuracy * PERCENTAGE_MULTIPLIER).toFixed(0)}%
      </strong>
      <span className="mt-2 rounded-full bg-black/10 px-3 py-1 text-xs font-medium">
        {totalCorrect} acertos em {totalQuestions} questões
      </span>
    </div>
  );
}
