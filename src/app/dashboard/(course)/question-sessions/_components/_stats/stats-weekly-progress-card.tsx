import { getAccuracyColor } from '../../_utils';

const PERCENTAGE_MULTIPLIER = 100;

type StatsWeeklyProgressCardProps = {
  accuracy: number;
  totalQuestions: number;
};

export function StatsWeeklyProgressCard({
  accuracy,
  totalQuestions,
}: StatsWeeklyProgressCardProps) {
  const accuracyPercentage = accuracy * PERCENTAGE_MULTIPLIER;

  return (
    <div className="card flex flex-col justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">📅</span>
        <h3 className="text-sm font-bold tracking-widest uppercase opacity-60">
          Esta Semana
        </h3>
      </div>
      <div>
        <p className="text-4xl font-black">
          {accuracyPercentage.toFixed(0)}
          <span className="text-lg font-bold opacity-60">%</span>
        </p>
        <p className="mt-1 text-xs opacity-50">
          {totalQuestions} questões respondidas
        </p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--foreground)/10">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${accuracyPercentage}%`,
            backgroundColor: getAccuracyColor(accuracyPercentage),
          }}
        />
      </div>
    </div>
  );
}
