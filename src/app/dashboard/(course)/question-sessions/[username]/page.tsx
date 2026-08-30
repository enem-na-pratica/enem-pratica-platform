import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { ApiError } from '@/src/web/api/http/api-error';
import { Header } from '@/src/web/components';

import {
  QuestionSessionFormPanel,
  QuestionSessionToggleProvider,
  SessionToggleButton,
} from '../_components/_form';
import { fetchListSubjects, fetchUserQuestionSessionStats } from '../api';
import { QuestionSessionListSection, StatsSection } from './_components';
import { BackArrow } from './_components/icons';

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function QuestionSessionPage({ params }: PageProps) {
  const resolvedParams = await params;
  let statistics, questionSessions, subjects;
  try {
    [{ statistics, questionSessions }, subjects] = await Promise.all([
      fetchUserQuestionSessionStats(resolvedParams.username),
      fetchListSubjects(),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    if (error instanceof ApiError && error.status === 403) {
      redirect('/access-denied');
    }
    throw error;
  }

  return (
    <div className="min-h-screen bg-(--background) pb-20 text-(--foreground) transition-colors duration-500">
      <Header>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            aria-label="Voltar para Dashboard"
          >
            <BackArrow />
          </Link>
          <h1 className="text-xl font-bold tracking-tight">
            Questões e Desempenho de{' '}
            <span className="text-(--accent)">@{resolvedParams.username}</span>
          </h1>
        </div>
      </Header>

      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
        {/* --- Statistics section --- */}
        {questionSessions.length > 0 && (
          <StatsSection statistics={statistics} />
        )}

        <hr className="border-(--foreground)/10" />

        <QuestionSessionToggleProvider>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Histórico</h2>
            <SessionToggleButton />
          </div>

          {/* --- Form for registering new sessions --- */}
          <QuestionSessionFormPanel
            subjects={subjects}
            targetUsername={resolvedParams.username}
          />
        </QuestionSessionToggleProvider>

        {/* --- Session listing section --- */}
        <QuestionSessionListSection questionSessions={questionSessions} />
      </main>
    </div>
  );
}
