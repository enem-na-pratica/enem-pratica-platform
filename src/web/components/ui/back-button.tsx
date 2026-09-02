'use client';

import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      aria-label="Voltar para a página anterior"
      className="flex cursor-pointer items-center justify-center border-none bg-transparent p-0 text-inherit"
    >
      <ArrowLeft className="h-6 w-6 transition-colors hover:text-(--accent)" />
    </button>
  );
}
