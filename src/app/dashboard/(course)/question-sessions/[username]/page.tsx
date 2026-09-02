import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { ApiError } from '@/src/web/api/http/api-error';
import { Header } from '@/src/web/components';

import { QuestionSessionListSection, StatsSection } from '../_components';
import {
  QuestionSessionFormPanel,
  QuestionSessionToggleProvider,
  SessionToggleButton,
} from '../_components/_form';
import { fetchListSubjects, fetchUserQuestionSessionStats } from '../api';

const FORBIDDEN = 403;
const NOT_FOUND = 404;

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function QuestionSessionPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { statistics, questionSessions, subjects } = await fetchPageData(
    resolvedParams.username,
  );

  return (
    <div className="min-h-screen bg-(--background) pb-20 text-(--foreground) transition-colors duration-500">
      <QuestionSessionHeader username={resolvedParams.username} />

      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
        {questionSessions.length > 0 && (
          <StatsSection statistics={statistics} />
        )}

        <hr className="border-(--foreground)/10" />

        <QuestionSessionToggleProvider>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Histórico</h2>
            <SessionToggleButton />
          </div>

          <QuestionSessionFormPanel
            subjects={subjects}
            targetUsername={resolvedParams.username}
          />
        </QuestionSessionToggleProvider>

        <QuestionSessionListSection questionSessions={questionSessions} />
      </main>
    </div>
  );
}

async function fetchPageData(username: string) {
  try {
    const [statsResult, subjects] = await Promise.all([
      fetchUserQuestionSessionStats(username),
      fetchListSubjects(),
    ]);
    return {
      statistics: statsResult.statistics,
      questionSessions: statsResult.questionSessions,
      subjects,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === NOT_FOUND) notFound();
      if (error.status === FORBIDDEN) redirect('/access-denied');
    }
    throw error;
  }
}

function QuestionSessionHeader({ username }: { username: string }) {
  return (
    <Header>
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard?tab=users"
          aria-label="Voltar para Dashboard"
        >
          <ArrowLeft className="h-6 w-6 transition-colors hover:text-(--accent)" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">
          Questões e Desempenho de{' '}
          <span className="text-(--accent)">@{username}</span>
        </h1>
      </div>
    </Header>
  );
}
