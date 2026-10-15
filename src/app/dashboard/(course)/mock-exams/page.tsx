import { BackButton, Header } from '@/src/web/components';

import { MockExamListSection, MockStatsSection } from './_components';
import {
  MockExamFormPanel,
  MockExamToggleButton,
  MockExamToggleProvider,
} from './_components/_form';
import { fetchListMockExamByAuthor, fetchMockExamStatsByAuthor } from './api';

export default async function MockExamsPage() {
  const [mockExams, stats] = await Promise.all([
    fetchListMockExamByAuthor(),
    fetchMockExamStatsByAuthor(),
  ]);

  return (
    <div className="min-h-screen bg-(--background) pb-20 text-(--foreground) transition-colors duration-500">
      <Header>
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-xl font-bold tracking-tight">
            Meus <span className="text-(--accent)">Simulados</span>
          </h1>
        </div>
      </Header>

      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
        {stats.totalMockExams > 0 && <MockStatsSection stats={stats} />}

        <hr className="border-(--foreground)/10" />

        <MockExamToggleProvider>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Histórico</h2>
            <MockExamToggleButton />
          </div>
          <MockExamFormPanel />
        </MockExamToggleProvider>

        <MockExamListSection mockExams={mockExams} />
      </main>
    </div>
  );
}
