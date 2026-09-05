import type { MockExamStatistics } from '@/src/web/api';

import { StatsAreaPerformanceCard } from './stats-area-performance-card';
import { StatsErrorAnalysisCard } from './stats-error-analysis-card';
import { StatsGlobalPerformanceCard } from './stats-global-performance-card';

export function MockStatsSection({ stats }: { stats: MockExamStatistics }) {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-4 duration-500 md:grid-cols-2 lg:grid-cols-4">
      <StatsGlobalPerformanceCard
        globalAveragePerformance={stats.globalAveragePerformance}
      />

      <StatsAreaPerformanceCard performancePerArea={stats.performancePerArea} />

      <StatsErrorAnalysisCard errorPrevalence={stats.errorPrevalence} />
    </section>
  );
}
