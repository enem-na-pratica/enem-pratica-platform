import type { MockExam } from '@/src/web/api';

import { calculateMockExamTotals } from '../../_utils';
import { MockExamHeader } from './mock-exam-header';
import { MockExamTable } from './mock-exam-table';

const TOTAL_QUESTIONS_GLOBAL = 180;
const PERCENTAGE_MULTIPLIER = 100;

export function MockExamItem({ mock }: { mock: MockExam }) {
  const totals = calculateMockExamTotals(mock);
  const { totalCorrect, totalCertainty } = totals;

  const globalPerformance =
    (totalCorrect / TOTAL_QUESTIONS_GLOBAL) * PERCENTAGE_MULTIPLIER;
  const globalConfidence =
    totalCorrect > 0
      ? (totalCertainty / totalCorrect) * PERCENTAGE_MULTIPLIER
      : 0;

  return (
    <div className="card card-interactive overflow-hidden border-t-4 border-(--accent) p-0">
      <MockExamHeader
        title={mock.title}
        createdAt={mock.createdAt}
        globalPerformance={globalPerformance}
      />

      {/*TODO: Improvement suggestion: it might be worth considering a dropdown in the
      future. This way, only the basic information is shown initially, and
      additional details are revealed on user interaction, keeping the UI clean
      and uncluttered. */}
      <MockExamTable
        mock={mock}
        totals={totals}
        globalPerformance={globalPerformance}
        globalConfidence={globalConfidence}
      />
    </div>
  );
}
