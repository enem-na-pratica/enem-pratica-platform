'use client';

import type { Subject } from '@/src/web/api';

import { useReviewPractice } from '../_hooks/use-review-practice';
import { PracticeColumns } from './practice-columns';
import { PracticeEmptyState } from './practice-empty-state';
import { PracticeSkeletons } from './practice-skeletons';
import { SubjectSelector } from './subject-selector';

export function ReviewPracticeClient({
  subjects,
  targetUsername,
}: {
  subjects: Subject[];
  targetUsername?: string;
}) {
  const {
    selectedSubjectId,
    isLoadingSubject,
    hasLoaded,
    practice,
    review,
    handleSubjectChange,
  } = useReviewPractice({ targetUsername });

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-4 py-8 pb-20">
      <section className="text-center md:text-left">
        <h2 className="text-2xl font-bold">Revisão e Prática</h2>
        <p className="mt-1 text-sm opacity-60">
          Selecione uma matéria para ver os assuntos que precisam de atenção.
        </p>
      </section>

      <SubjectSelector
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        isLoadingSubject={isLoadingSubject}
        onChange={handleSubjectChange}
      />

      {hasLoaded && !isLoadingSubject && (
        <PracticeColumns
          practice={practice}
          review={review}
        />
      )}

      {isLoadingSubject && <PracticeSkeletons />}

      {!hasLoaded && !isLoadingSubject && <PracticeEmptyState />}
    </main>
  );
}
