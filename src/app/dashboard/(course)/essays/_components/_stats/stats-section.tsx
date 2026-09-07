import type { EssayStatistics } from '@/src/web/api';

import { StatsAverageHeroCard } from './stats-average-hero-card';
import { StatsCompetencyCard } from './stats-competency-card';

export function StatsSection({ statistics }: { statistics: EssayStatistics }) {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-4 duration-500 md:grid-cols-2 lg:grid-cols-4">
      <StatsAverageHeroCard
        globalAverage={statistics.globalAverage}
        totalCount={statistics.totalCount}
      />

      <StatsCompetencyCard
        averagesPerCompetency={statistics.averagesPerCompetency}
      />
    </section>
  );
}
