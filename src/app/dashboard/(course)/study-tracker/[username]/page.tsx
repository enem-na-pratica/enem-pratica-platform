import Link from 'next/link';

import { Header } from '@/src/web/components';

import { BackArrow } from './_components/icons';
import { StudyTrackerClient } from './_components/study-tracker-client';
import { fetchSubjects } from './api';

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function StudyTrackerPage({ params }: PageProps) {
  const [resolvedParams, subjects] = await Promise.all([
    params,
    fetchSubjects(),
  ]);

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
            Acompanhamento de Estudos de{' '}
            <span className="text-(--accent)">@{resolvedParams.username}</span>
          </h1>
        </div>
      </Header>
      <StudyTrackerClient
        subjects={subjects}
        targetUsername={resolvedParams.username}
      />
    </>
  );
}
