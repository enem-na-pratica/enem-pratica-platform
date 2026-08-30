import Link from 'next/link';

import { Header } from '@/src/web/components';

import { QuestionSessionListSection, StatsSection } from './_components';
import {
  QuestionSessionFormPanel,
  QuestionSessionToggleProvider,
  SessionToggleButton,
} from './_components/_form';
import { BackArrow } from './_components/icons';
import { fetchListSubjects, fetchUserQuestionSessionStats } from './api';

export default async function QuestionSessionPage() {
  const [{ statistics, questionSessions }, subjects] = await Promise.all([
    fetchUserQuestionSessionStats(),
    fetchListSubjects(),
  ]);

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
            Questões e <span className="text-(--accent)">Desempenho</span>
          </h1>
        </div>
      </Header>

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

          <QuestionSessionFormPanel subjects={subjects} />
        </QuestionSessionToggleProvider>

        <QuestionSessionListSection questionSessions={questionSessions} />
      </main>
    </div>
  );
}
