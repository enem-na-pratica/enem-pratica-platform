import { notFound, redirect } from 'next/navigation';

import { ApiError } from '@/src/web/api/http/api-error';
import { BackButton, Header } from '@/src/web/components';

import { EssayListSection, StatsSection } from '../_components';
import {
  EssayFormPanel,
  EssayToggleButton,
  EssayToggleProvider,
} from '../_components/_form';
import { fetchUserEssaysStats } from '../api';

const FORBIDDEN = 403;
const NOT_FOUND = 404;

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function EssayPage({ params }: PageProps) {
  const resolvedParams = await params;

  const { essays, statistics } = await fetchPageData(resolvedParams.username);

  return (
    <div className="min-h-screen bg-(--background) pb-20 text-(--foreground) transition-colors duration-500">
      <EssayHeader username={resolvedParams.username} />

      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
        {essays.length > 0 && <StatsSection statistics={statistics} />}

        <hr className="border-(--foreground)/10" />

        <EssayToggleProvider>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Histórico</h2>
            <EssayToggleButton />
          </div>

          <EssayFormPanel targetUsername={resolvedParams.username} />
        </EssayToggleProvider>

        <EssayListSection essays={essays} />
      </main>
    </div>
  );
}

async function fetchPageData(username: string) {
  try {
    return await fetchUserEssaysStats(username);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === NOT_FOUND) notFound();
      if (error.status === FORBIDDEN) redirect('/access-denied');
    }
    throw error;
  }
}

function EssayHeader({ username }: { username: string }) {
  return (
    <Header>
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-xl font-bold tracking-tight">
          Redações de <span className="text-(--accent)">@{username}</span>
        </h1>
      </div>
    </Header>
  );
}
