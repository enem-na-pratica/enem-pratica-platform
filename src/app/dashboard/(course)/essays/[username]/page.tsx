import { notFound, redirect } from 'next/navigation';

import { ApiError } from '@/src/web/api/http/api-error';
import { BackButton, Header } from '@/src/web/components';

import {
  EssayFormPanel,
  EssayToggleButton,
  EssayToggleProvider,
} from '../_components/_form';
import { fetchUserEssaysStats } from '../api';
import { EssayListSection, StatsSection } from './_components';

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function EssayPage({ params }: PageProps) {
  const resolvedParams = await params;

  let essays, statistics;
  try {
    const result = await fetchUserEssaysStats(resolvedParams.username);
    essays = result.essays;
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
            Redações de{' '}
            <span className="text-(--accent)">@{resolvedParams.username}</span>
          </h1>
        </div>
      </Header>

      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
        {/* --- Statistics section --- */}
        {essays.length > 0 && <StatsSection statistics={statistics} />}

        <hr className="border-(--foreground)/10" />

        <EssayToggleProvider>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Histórico</h2>
            <EssayToggleButton />
          </div>

          <EssayFormPanel targetUsername={resolvedParams.username} />
        </EssayToggleProvider>

        {/* --- Essay listing section --- */}
        <EssayListSection essays={essays} />
      </main>
    </div>
  );
}
