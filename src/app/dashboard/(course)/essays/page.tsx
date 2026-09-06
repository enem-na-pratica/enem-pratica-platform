import { BackButton, Header } from '@/src/web/components';

import { EssayListSection, StatsSection } from './_components';
import {
  EssayFormPanel,
  EssayToggleButton,
  EssayToggleProvider,
} from './_components/_form';
import { fetchUserEssaysStats } from './api';

export default async function EssayPage() {
  const { essays, statistics } = await fetchUserEssaysStats();

  return (
    <div className="min-h-screen bg-(--background) pb-20 text-(--foreground) transition-colors duration-500">
      <Header>
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-xl font-bold tracking-tight">
            Minhas <span className="text-(--accent)">Redações</span>
          </h1>
        </div>
      </Header>

      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
        {essays.length > 0 && <StatsSection statistics={statistics} />}

        <hr className="border-(--foreground)/10" />

        <EssayToggleProvider>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Histórico</h2>
            <EssayToggleButton />
          </div>

          <EssayFormPanel />
        </EssayToggleProvider>

        <EssayListSection essays={essays} />
      </main>
    </div>
  );
}
