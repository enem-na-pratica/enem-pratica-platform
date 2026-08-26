import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { Header } from '@/src/web/components';

import { ReviewPracticeClient } from '../_components/review-practice-client';
import { fetchSubjects } from '../api';

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
            <ArrowLeft className="h-6 w-6 transition-colors hover:text-(--accent)" />
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
