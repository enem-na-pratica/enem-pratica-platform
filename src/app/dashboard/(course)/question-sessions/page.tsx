import { BackButton, Header } from '@/src/web/components';

import { QuestionSessionListSection, StatsSection } from './_components';
import {
  QuestionSessionFormPanel,
  QuestionSessionToggleProvider,
  SessionToggleButton,
} from './_components/_form';
import {
  fetchListSubjects,
  fetchQuestionSessionStatsByAuthor,
  fetchUserQuestionSessionStats,
} from './api';

export default async function QuestionSessionPage() {
  const [{ questionSessions }, subjects, stats] = await Promise.all([
    fetchUserQuestionSessionStats(),
    fetchListSubjects(),
    fetchQuestionSessionStatsByAuthor(),
  ]);

  return (
    <div className="min-h-screen bg-(--background) pb-20 text-(--foreground) transition-colors duration-500">
      <Header>
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-xl font-bold tracking-tight">
            Questões e <span className="text-(--accent)">Desempenho</span>
          </h1>
        </div>
      </Header>

      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
        {questionSessions.length > 0 && <StatsSection statistics={stats} />}

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
