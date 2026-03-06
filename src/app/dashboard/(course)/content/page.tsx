import Link from 'next/link';

import { Header } from '@/src/web/components';

import { BackArrow } from './_components/icons';
import { StudyTrackerClient } from './_components/study-tracker-client';
import { fetchSubjects } from './api';

export default async function StudyTrackerPage() {
  const subjects = await fetchSubjects();

  return (
    <>
      <Header>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            aria-label="Voltar para Dashboard"
          >
            <BackArrow />
          </Link>
          <h1 className="text-xl font-bold tracking-tight">
            Study <span className="text-(--accent)">Tracker</span>
          </h1>
        </div>
      </Header>
      <StudyTrackerClient subjects={subjects} />
    </>
  );
}
