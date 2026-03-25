import Link from 'next/link';

import { Header } from '@/src/web/components';

import { BackArrow, ReviewPracticeClient } from './_components';
import { fetchSubjects } from './api';

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function ReviewPracticePage({ params }: PageProps) {
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
            Revisão e Prática de{' '}
            <span className="text-(--accent)">@{resolvedParams.username}</span>
          </h1>
        </div>
      </Header>
      <ReviewPracticeClient
        subjects={subjects}
        targetUsername={resolvedParams.username}
      />
    </>
  );
}
