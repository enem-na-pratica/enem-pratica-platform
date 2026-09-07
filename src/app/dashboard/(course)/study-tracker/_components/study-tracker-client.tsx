'use client';

import type { Subject } from '@/src/web/api';

import { useStudyTracker } from '../_hooks/use-study-tracker';
import { StudyTrackerEmptyState } from './study-tracker-empty-state';
import { SubjectSelector } from './subject-selector';
import { TopicsPanel } from './topics-panel';
import { TopicsSkeleton } from './topics-skeleton';

export function StudyTrackerClient({
  subjects,
  targetUsername,
}: {
  subjects: Subject[];
  targetUsername?: string;
}) {
  const {
    selectedSubjectSlug,
    isLoadingSubject,
    hasLoadedTopics,
    topics,
    handleSubjectChange,
    handleStatusChange,
  } = useStudyTracker({ subjects, targetUsername });

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-4 py-8 pb-20">
      <section className="text-center md:text-left">
        <h2 className="text-2xl font-bold">Acompanhe seu progresso</h2>
        <p className="mt-1 text-sm opacity-60">
          Selecione uma matéria e marque o status de cada assunto.
        </p>
      </section>

      <SubjectSelector
        subjects={subjects}
        selectedSubjectSlug={selectedSubjectSlug}
        isLoadingSubject={isLoadingSubject}
        onChange={handleSubjectChange}
      />

      {isLoadingSubject && <TopicsSkeleton />}

      {hasLoadedTopics && !isLoadingSubject && (
        <TopicsPanel
          topics={topics}
          onStatusChange={handleStatusChange}
        />
      )}

      {!hasLoadedTopics && !isLoadingSubject && <StudyTrackerEmptyState />}
    </main>
  );
}
