'use client';

import type { QuestionSessionWithTopicAndSubject } from '@/src/web/api';

import { useSessionReviewToggle } from '../_hooks/use-session-review-toggle';
import { ReviewToggleButton } from './review-toggle-button';
import { SessionCounts } from './session-counts';
import { SessionInfo } from './session-info';
import { SessionPerformance } from './session-performance';

export function QuestionSessionItem({
  session,
}: {
  session: QuestionSessionWithTopicAndSubject;
}) {
  const { isReviewed, isUpdating, handleToggleReview } = useSessionReviewToggle(
    {
      questionSessionId: session.id,
      initialIsReviewed: session.isReviewed,
    },
  );

  return (
    <div
      className={`card card-interactive flex flex-col gap-4 border-l-4 py-4 transition-all duration-300 md:flex-row md:items-center md:gap-8 ${
        isReviewed ? 'border-green-500/60' : 'border-(--accent)'
      }`}
    >
      <SessionInfo session={session} />

      <SessionCounts
        total={session.total}
        correct={session.correct}
        incorrect={session.incorrect}
      />

      <div className="flex items-center justify-between gap-6 md:justify-end">
        <SessionPerformance performance={session.performance} />
        <ReviewToggleButton
          isReviewed={isReviewed}
          isUpdating={isUpdating}
          onToggle={handleToggleReview}
        />
      </div>
    </div>
  );
}
