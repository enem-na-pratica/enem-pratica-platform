import { notFound, redirect } from 'next/navigation';

import { ApiError } from '@/src/web/api/http/api-error';
import { BackButton, Header } from '@/src/web/components';

import {
  MockExamFormPanel,
  MockExamToggleButton,
  MockExamToggleProvider,
} from '../_components/_form';
import { fetchUserMockExamsStats } from '../api';
import { MockExamListSection, MockStatsSection } from './_components';

type MockExamsPageProps = {
  params: Promise<{ username: string }>;
};

export default async function MockExamsPage({ params }: MockExamsPageProps) {
  const resolvedParams = await params;

  let mockExams, statistics;
  try {
    const result = await fetchUserMockExamsStats(resolvedParams.username);
    mockExams = result.mockExams;
    statistics = result.statistics;
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
          <BackButton />
          <h1 className="text-xl font-bold tracking-tight">
            Simulados de{' '}
            <span className="text-(--accent)">@{resolvedParams.username}</span>
          </h1>
        </div>
      </Header>

      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
        {/* --- Statistics section --- */}
        {mockExams.length > 0 && <MockStatsSection stats={statistics} />}

        <hr className="border-(--foreground)/10" />

        <MockExamToggleProvider>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Histórico</h2>
            <MockExamToggleButton />
          </div>
          <MockExamFormPanel username={resolvedParams.username} />
        </MockExamToggleProvider>

        {/* --- List Section --- */}
        <MockExamListSection mockExams={mockExams} />
      </main>
    </div>
  );
}

// Back arrow icon (Reused)
function BackArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className="h-6 w-6 transition-colors hover:text-(--accent)"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
      />
    </svg>
  );
}
