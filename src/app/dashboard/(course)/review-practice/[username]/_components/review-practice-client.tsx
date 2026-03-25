/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
'use client';

import { useState } from 'react';

import { notFound, redirect } from 'next/navigation';

import type { Subject, TopicProgress } from '@/src/web/api';
import { ApiError } from '@/src/web/api/http/api-error';

import { fetchTopicsBySubjectAndStatus } from '../api';
import { ChevronIcon, SpinnerIcon } from './icons';

function EmptyColumn({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center opacity-50 select-none">
      <p className="mb-3 text-4xl">🎉</p>
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}

function TopicList({
  topics,
  isLoading,
}: {
  topics: TopicProgress[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2 p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 rounded-lg bg-(--foreground)/10"
          />
        ))}
      </div>
    );
  }

  if (topics.length === 0) {
    return <EmptyColumn message="Nenhum assunto aqui. Continue assim!" />;
  }

  return (
    <ul className="divide-y divide-(--foreground)/10">
      {topics.map((tp) => (
        <li
          key={tp.topic.id}
          className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-(--foreground)/5"
        >
          <span className="w-5 shrink-0 text-right font-mono text-xs opacity-30">
            {tp.topic.position}
          </span>
          <span className="text-sm leading-snug font-medium">
            {tp.topic.title}
          </span>
        </li>
      ))}
    </ul>
  );
}

type ColumnData = {
  topics: TopicProgress[];
  isLoading: boolean;
};

type PageProps = {
  targetUsername: string;
  subjects: Subject[];
};

export function ReviewPracticeClient({ subjects, targetUsername }: PageProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [isLoadingSubject, setIsLoadingSubject] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [practice, setPractice] = useState<ColumnData>({
    topics: [],
    isLoading: false,
  });
  const [review, setReview] = useState<ColumnData>({
    topics: [],
    isLoading: false,
  });

  const handleSubjectChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const slug = e.target.value;
    if (!slug) return;

    setSelectedSubjectId(slug);
    setIsLoadingSubject(true);
    setHasLoaded(false);
    setPractice({ topics: [], isLoading: true });
    setReview({ topics: [], isLoading: true });

    try {
      const [practiceData, reviewData] = await Promise.all([
        fetchTopicsBySubjectAndStatus({
          subjectSlug: slug,
          status: ['PRACTICE'],
          targetUsername,
        }),
        fetchTopicsBySubjectAndStatus({
          subjectSlug: slug,
          status: ['REVIEW'],
          targetUsername,
        }),
      ]);
      setPractice({ topics: practiceData, isLoading: false });
      setReview({ topics: reviewData, isLoading: false });
      setHasLoaded(true);
    } catch (error) {
      // TODO: useNotify
      setPractice({ topics: [], isLoading: false });
      setReview({ topics: [], isLoading: false });

      if (error instanceof ApiError && error.status === 404) {
        notFound();
      }
      if (error instanceof ApiError && error.status === 403) {
        redirect('/access-denied');
      }
      throw error;
    } finally {
      setIsLoadingSubject(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-4 py-8 pb-20">
      {/* Page intro */}
      <section className="text-center md:text-left">
        <h2 className="text-2xl font-bold">Revisão e Prática</h2>
        <p className="mt-1 text-sm opacity-60">
          Selecione uma matéria para ver os assuntos que precisam de atenção.
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
            className={`input appearance-none pr-10 font-semibold transition-all duration-200 ${isLoadingSubject ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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

      {/* Two columns */}
      {hasLoaded && !isLoadingSubject && (
        <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-6 duration-500 sm:grid-cols-2">
          {/* Practice column */}
          <div className="card overflow-hidden border border-(--foreground)/10 p-0">
            <div className="flex items-center gap-2 border-b border-(--foreground)/10 px-4 py-3">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-yellow-500" />
              <h3 className="text-sm font-bold tracking-widest uppercase opacity-70">
                Praticar
              </h3>
              <span className="ml-auto rounded-full bg-(--foreground)/5 px-2 py-0.5 font-mono text-xs opacity-40">
                {practice.topics.length}
              </span>
            </div>
            <TopicList
              topics={practice.topics}
              isLoading={practice.isLoading}
            />
          </div>

          {/* Review column */}
          <div className="card overflow-hidden border border-(--foreground)/10 p-0">
            <div className="flex items-center gap-2 border-b border-(--foreground)/10 px-4 py-3">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
              <h3 className="text-sm font-bold tracking-widest uppercase opacity-70">
                Revisar
              </h3>
              <span className="ml-auto rounded-full bg-(--foreground)/5 px-2 py-0.5 font-mono text-xs opacity-40">
                {review.topics.length}
              </span>
            </div>
            <TopicList
              topics={review.topics}
              isLoading={review.isLoading}
            />
          </div>
        </div>
      )}

      {/* Loading skeletons before data arrives */}
      {isLoadingSubject && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="card animate-pulse overflow-hidden border border-(--foreground)/10 p-0"
            >
              <div className="h-11 border-b border-(--foreground)/10 bg-(--foreground)/5" />
              <div className="space-y-2 p-4">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-10 rounded-lg bg-(--foreground)/10"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!hasLoaded && !isLoadingSubject && (
        <div className="py-24 text-center opacity-30 select-none">
          <p className="mb-4 text-5xl">✍️</p>
          <p className="font-semibold">
            Selecione uma matéria acima para ver os assuntos.
          </p>
        </div>
      )}
    </main>
  );
}
