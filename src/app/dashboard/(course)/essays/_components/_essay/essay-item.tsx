import type { Essay } from '@/src/web/api';

import { EssayCompetencies } from './essay-competencies';
import { EssayInfo } from './essay-info';
import { EssayTotal } from './essay-total';

export function EssayItem({ essay }: { essay: Essay }) {
  return (
    <div className="card card-interactive flex flex-col gap-4 border-l-4 border-(--accent) py-4 md:flex-row md:items-center md:gap-8">
      <EssayInfo essay={essay} />

      <EssayCompetencies grades={essay.grades} />

      <div className="flex items-center justify-between gap-6 md:justify-end">
        <EssayTotal total={essay.grades.total} />
      </div>
    </div>
  );
}
