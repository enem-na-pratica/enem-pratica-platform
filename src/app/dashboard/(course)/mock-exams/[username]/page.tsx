import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { makeMockExamService } from '@/src/web/api';
import { ApiError } from '@/src/web/api/http/api-error';
import { Header } from '@/src/web/components';

import {
  MockExamForm,
  MockExamListSection,
  MockStatsSection,
} from './_components';

type PageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ showForm?: string }>;
};

export default async function MockExamsPage({
  params,
  searchParams,
}: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const isFormOpen = resolvedSearchParams.showForm === 'true';

  let mockExams, statistics;
  try {
    const result = await makeMockExamService().listMockExamsStatisticsForUser(
      resolvedParams.username,
    );
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
          <Link
            href="/dashboard"
            aria-label="Voltar para Dashboard"
          >
            <BackArrow />
          </Link>
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

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Histórico</h2>
          <Link
            href={isFormOpen ? '?' : '?showForm=true'}
            className="button-primary flex items-center gap-2 shadow-(--accent)/20 shadow-lg"
          >
            <span>{isFormOpen ? 'Cancelar' : 'Novo Simulado'}</span>
            {!isFormOpen && <span>+</span>}
          </Link>
        </div>

        {/* --- Form for registering new Mock Exams --- */}
        {isFormOpen && (
          <MockExamForm targetUsername={resolvedParams.username} />
        )}

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
