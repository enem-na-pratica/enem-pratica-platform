'use client';

import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

type BackButtonProps = {
  href?: string;
};

export function BackButton({ href }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Voltar para a página anterior"
      className="flex cursor-pointer items-center justify-center border-none bg-transparent p-0 text-inherit"
    >
      <ArrowLeft className="h-6 w-6 transition-colors hover:text-(--accent)" />
    </button>
  );
}
