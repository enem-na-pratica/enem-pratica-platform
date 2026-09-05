import { notFound, redirect } from 'next/navigation';

import { ApiError } from '@/src/web/api/http/api-error';
import { BackButton, Header } from '@/src/web/components';

import { MockExamListSection, MockStatsSection } from '../_components';
import {
  MockExamFormPanel,
  MockExamToggleButton,
  MockExamToggleProvider,
} from '../_components/_form';
import { fetchUserMockExamsStats } from '../api';

const FORBIDDEN = 403;
const NOT_FOUND = 404;

type MockExamsPageProps = {
  params: Promise<{ username: string }>;
};

export default async function MockExamsPage({ params }: MockExamsPageProps) {
  const resolvedParams = await params;

  const { mockExams, statistics } = await fetchPageData(
    resolvedParams.username,
  );

  return (
    <div className="min-h-screen bg-(--background) pb-20 text-(--foreground) transition-colors duration-500">
      <MockExamHeader username={resolvedParams.username} />
      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
        {mockExams.length > 0 && <MockStatsSection stats={statistics} />}

        <hr className="border-(--foreground)/10" />

        <MockExamToggleProvider>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Histórico</h2>
            <MockExamToggleButton />
          </div>
          <MockExamFormPanel username={resolvedParams.username} />
        </MockExamToggleProvider>

        <MockExamListSection mockExams={mockExams} />
      </main>
    </div>
  );
}

async function fetchPageData(username: string) {
  try {
    const { mockExams, statistics } = await fetchUserMockExamsStats(username);
    return { statistics, mockExams };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === NOT_FOUND) notFound();
      if (error.status === FORBIDDEN) redirect('/access-denied');
    }
    throw error;
  }
}

function MockExamHeader({ username }: { username: string }) {
  return (
    <Header>
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-xl font-bold tracking-tight">
          Simulados de <span className="text-(--accent)">@{username}</span>
        </h1>
      </div>
    </Header>
  );
}
