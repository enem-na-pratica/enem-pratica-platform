'use client';
import { useState } from 'react';

import type { Subject, TopicProgress } from '@/src/web/api';
import type { TopicStatus } from '@/src/web/config';

import { fetchTopicsBySubject, updateTopicStatus } from '../api';
import { ChevronIcon, SpinnerIcon } from './icons';
import { ProgressSummary } from './progress-summary';
import { TopicRow } from './topic-row';

export function StudyTrackerClient({ subjects }: { subjects: Subject[] }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [isLoadingSubject, setIsLoadingSubject] = useState(false);
  const [topics, setTopics] = useState<TopicProgress[]>([]);
  const [hasLoadedTopics, setHasLoadedTopics] = useState(false);

  const handleSubjectChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const id = e.target.value;
    if (!id) return;
    setSelectedSubjectId(id);
    setIsLoadingSubject(true);
    setHasLoadedTopics(false);
    setTopics([]);
    try {
      const data = await fetchTopicsBySubject(id);
      setTopics(data);
      setHasLoadedTopics(true);
    } catch {
      // TODO: useNotify
    } finally {
      setIsLoadingSubject(false);
    }
  };

  const handleStatusChange = async (
    topicId: string,
    newStatus: TopicStatus,
  ) => {
    await updateTopicStatus(topicId, newStatus);
    // Optimistically update local state on success
    setTopics((prev) =>
      prev.map((tp) =>
        tp.topic.id === topicId
          ? {
              ...tp,
              progress: tp.progress
                ? { ...tp.progress, status: newStatus, updatedAt: new Date() }
                : {
                    id: `p-${topicId}`,
                    authorId: 'me',
                    topicId,
                    status: newStatus,
                    updatedAt: new Date(),
                    createdAt: new Date(),
                  },
            }
          : tp,
      ),
    );
  };

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-4 py-8 pb-20">
      {/* Page intro */}
      <section className="text-center md:text-left">
        <h2 className="text-2xl font-bold">Acompanhe seu progresso</h2>
        <p className="mt-1 text-sm opacity-60">
          Selecione uma matéria e marque o status de cada assunto.
        </p>
      </section>

      {/* Subject selector */}
      <div className="card border border-(--foreground)/10">
        <label className="mb-2 block text-sm font-bold tracking-widest uppercase opacity-70">
          Matéria
        </label>
        <div className="relative">
          <select
            value={selectedSubjectId}
            onChange={handleSubjectChange}
            disabled={isLoadingSubject}
            className={`input appearance-none pr-10 font-semibold transition-all duration-200 ${isLoadingSubject ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} `}
          >
            <option
              value=""
              disabled
            >
              — Escolha uma matéria para começar —
            </option>
            {subjects.map((s) => (
              <option
                key={s.id}
                value={s.slug}
              >
                {s.name}
                {s.category ? ` — ${s.category}` : ''}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 opacity-50">
            {isLoadingSubject ? <SpinnerIcon /> : <ChevronIcon />}
          </span>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoadingSubject && (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="card h-16 bg-(--card-background)/60"
            />
          ))}
        </div>
      )}

      {/* Topics list */}
      {hasLoadedTopics && !isLoadingSubject && (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
          {/* Summary bar */}
          {topics.length > 0 && <ProgressSummary topics={topics} />}

          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{selectedSubject?.name}</h2>
            <span className="rounded-full bg-(--foreground)/5 px-3 py-1 font-mono text-xs opacity-40">
              {topics.length} assunto{topics.length !== 1 ? 's' : ''}
            </span>
          </div>
          <hr className="border-(--foreground)/10" />

          {/* Column labels */}
          <div className="hidden items-center gap-3 px-4 sm:flex">
            <span className="w-5" />
            <span className="flex-1 text-xs font-bold tracking-widest uppercase opacity-40">
              Assunto
            </span>
            <span className="min-w-40 text-right text-xs font-bold tracking-widest uppercase opacity-40">
              Status
            </span>
          </div>

          {/* Rows */}
          <section className="grid grid-cols-1 gap-3">
            {topics.length === 0 ? (
              <div className="py-20 text-center opacity-50">
                <p>Nenhum assunto encontrado para esta matéria.</p>
              </div>
            ) : (
              topics.map((tp) => (
                <TopicRow
                  key={tp.topic.id}
                  topicProgress={tp}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </section>
        </div>
      )}

      {/* Empty state - nothing selected yet */}
      {!hasLoadedTopics && !isLoadingSubject && (
        <div className="py-24 text-center opacity-30 select-none">
          <p className="mb-4 text-5xl">📚</p>
          <p className="font-semibold">
            Selecione uma matéria acima para ver os assuntos.
          </p>
        </div>
      )}
    </main>
  );
}
