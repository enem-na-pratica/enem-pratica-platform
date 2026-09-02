import { BackButton, Header } from '@/src/web/components';

import { StudyTrackerClient } from './_components/study-tracker-client';
import { fetchSubjects } from './api';

export default async function StudyTrackerPage() {
  const subjects = await fetchSubjects();

  return (
    <>
      <Header>
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-xl font-bold tracking-tight">
            Acompanhamento de <span className="text-(--accent)">Estudos</span>
          </h1>
        </div>
      </Header>
      <StudyTrackerClient subjects={subjects} />
    </>
  );
}
