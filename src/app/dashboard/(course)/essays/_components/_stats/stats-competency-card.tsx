import { getCompetencyBarColor } from '../_utils';

const MAX_COMPETENCY_SCORE = 200;
const PERCENTAGE_MULTIPLIER = 100;

type StatsCompetencyCardProps = {
  averagesPerCompetency: Record<string, number>;
};

export function StatsCompetencyCard({
  averagesPerCompetency,
}: StatsCompetencyCardProps) {
  return (
    <div className="card flex flex-col justify-between p-5 lg:col-span-2">
      <h3 className="mb-3 text-sm font-bold uppercase opacity-60">
        Média por Competência
      </h3>
      <div className="space-y-3">
        {Object.entries(averagesPerCompetency).map(([competency, average]) => (
          <CompetencyBar
            key={competency}
            competency={competency}
            average={average}
          />
        ))}
      </div>
    </div>
  );
}

function CompetencyBar({
  competency,
  average,
}: {
  competency: string;
  average: number;
}) {
  const { bgBarColor, textBarColor } = getCompetencyTheme(average);

  return (
    <div className="flex items-center gap-3">
      <span className="w-6 font-mono text-xs uppercase opacity-50">
        {competency}
      </span>

      <div className="h-2 flex-1 overflow-hidden rounded-full bg-(--foreground)/10">
        <div
          className={`h-full transition-all duration-1000 ease-out ${bgBarColor}`}
          style={{
            width: `${(average / MAX_COMPETENCY_SCORE) * PERCENTAGE_MULTIPLIER}%`,
          }}
        />
      </div>
      <span className={`w-8 text-right text-xs font-bold ${textBarColor}`}>
        {average.toFixed(0)}
      </span>
    </div>
  );
}

function getCompetencyTheme(averageCompetencyRate: number) {
  const barColor = getCompetencyBarColor(averageCompetencyRate);
  const bgBarColor = `bg-[var(${barColor})]`;
  const textBarColor = `text-[var(${barColor})]`;

  return { barColor, bgBarColor, textBarColor };
}
