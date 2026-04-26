'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { QuestionSessionWithTopicAndSubject } from '@/src/web/api';

import { setIsReviewedAction } from '../actions';

export function QuestionSessionItem({
  session,
}: {
  session: QuestionSessionWithTopicAndSubject;
}) {
  const [isReviewed, setIsReviewed] = useState(session.isReviewed);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleReview = async () => {
    if (isUpdating) return;
    const next = !isReviewed;
    setIsReviewed(next);
    setIsUpdating(true);
    try {
      await setIsReviewedAction({
        questionSessionId: session.id,
        isReviewed: next,
      });
      toast.success(
        next
          ? 'Sessão marcada como revisada.'
          : 'Marcação de revisão removida.',
      );
    } catch {
      setIsReviewed(!next);
      toast.error('Erro ao atualizar. Tente novamente.');
    } finally {
      setIsUpdating(false);
    }
  };

  const date = new Date(session.date).toLocaleDateString('pt-BR', {
    timeZone: 'UTC',
  });

  const nextReviewLabel = isReviewed
    ? null
    : session.nextReviewDate
      ? new Date(session.nextReviewDate).toLocaleDateString('pt-BR', {
          timeZone: 'UTC',
        })
      : null;

  return (
    <div
      className={`card card-interactive flex flex-col gap-4 border-l-4 py-4 transition-all duration-300 md:flex-row md:items-center md:gap-8 ${
        isReviewed ? 'border-green-500/60' : 'border-(--accent)'
      }`}
    >
      {/* Left: subject + topic + date + next review */}
      <div className="min-w-0 flex-1">
        <span className="font-mono text-[10px] tracking-tighter uppercase opacity-50">
          {date} · {session.topic.subject.name}
        </span>
        <h3
          className="truncate text-base font-bold"
          title={session.topic.title}
        >
          {session.topic.title}
        </h3>
        {/* Next review date — only when session is not yet reviewed */}
        {nextReviewLabel && (
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-(--error)/20 bg-(--error)/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-(--error) uppercase">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-(--error)" />
            Revisar em {nextReviewLabel}
          </span>
        )}
        {/* {isReviewed && (
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-green-500 uppercase">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
            Revisado
          </span>
        )} */}
      </div>

      {/* Center: question counts */}
      <div className="flex items-center gap-5 border-x border-(--foreground)/5 px-4">
        <div className="text-center">
          <p className="text-[9px] font-bold uppercase opacity-40">Total</p>
          <p className="font-mono text-sm font-bold">{session.total}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-bold text-green-500/70 uppercase">
            Acertos
          </p>
          <p className="font-mono text-sm font-bold text-green-500">
            {session.correct}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-bold text-(--error)/70 uppercase">
            Erros
          </p>
          <p className="font-mono text-sm font-bold text-(--error)">
            {session.incorrect}
          </p>
        </div>
      </div>

      {/* Right: performance + reviewed toggle */}
      <div className="flex items-center justify-between gap-6 md:justify-end">
        {/* Performance */}
        <div className="text-right">
          <span className="block text-[10px] leading-none font-bold uppercase opacity-40">
            Rendimento
          </span>
          <span className="text-2xl font-black text-(--accent)">
            {(session.performance * 100).toFixed(0)}%
          </span>
        </div>

        {/* Reviewed toggle */}
        <button
          type="button"
          onClick={handleToggleReview}
          disabled={isUpdating}
          title={
            isReviewed ? 'Marcar como não revisado' : 'Marcar como revisado'
          }
          className={`relative flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all duration-200 select-none ${isUpdating ? 'cursor-not-allowed opacity-50' : ''} ${
            isReviewed
              ? 'border-green-500/30 bg-green-500/10 text-green-500 hover:bg-green-500/20'
              : 'border-(--foreground)/10 bg-(--foreground)/5 opacity-60 hover:border-(--foreground)/20 hover:opacity-100'
          }`}
        >
          {isUpdating ? (
            <svg
              className="h-3.5 w-3.5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : isReviewed ? (
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 111.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L15 7"
              />
            </svg>
          )}
          <span>{isReviewed ? 'Revisado' : 'Revisar'}</span>
        </button>
      </div>
    </div>
  );
}
