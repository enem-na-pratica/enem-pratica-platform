import type { QuestionSessionStatistics } from '@/src/web/api';

import { StatsAccuracyHeroCard } from './stats-accuracy-hero-card';
import { StatsPendingReviewsCard } from './stats-pending-reviews-card';
import { StatsStreakCard } from './stats-streak-card';
import { StatsTotalsRow } from './stats-totals-row';
import { StatsWeeklyProgressCard } from './stats-weekly-progress-card';

export function StatsSection({
  statistics,
}: {
  statistics: QuestionSessionStatistics;
}) {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-4 duration-500 md:grid-cols-2 lg:grid-cols-4">
      <StatsAccuracyHeroCard
        overallAccuracy={statistics.overallAccuracy}
        totalCorrect={statistics.totalCorrect}
        totalQuestions={statistics.totalQuestions}
      />

      <StatsWeeklyProgressCard
        accuracy={statistics.weeklyProgress.accuracy}
        totalQuestions={statistics.weeklyProgress.totalQuestions}
      />

      <div className="flex flex-col gap-4">
        <StatsStreakCard studyStreak={statistics.studyStreak} />
        <StatsPendingReviewsCard
          pendingReviewsCount={statistics.pendingReviewsCount}
        />
      </div>

      <StatsTotalsRow
        totalSessions={statistics.totalSessions}
        totalQuestions={statistics.totalQuestions}
        totalCorrect={statistics.totalCorrect}
        totalIncorrect={statistics.totalQuestions - statistics.totalCorrect}
      />
    </section>
  );
}
