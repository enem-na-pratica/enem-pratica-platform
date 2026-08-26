import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { Header } from '@/src/web/components';

import { ReviewPracticeClient } from './_components/review-practice-client';
import { fetchSubjects } from './api';

export default async function ReviewPracticePage() {
  const subjects = await fetchSubjects();

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
            Revisão e <span className="text-(--accent)">Prática</span>
          </h1>
        </div>
      </Header>
      <ReviewPracticeClient subjects={subjects} />
    </>
  );
}
