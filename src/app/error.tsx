'use client';

// import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  // useEffect(() => {
  //   // Log the error to an error reporting service if needed
  //   console.error(error);
  // }, [error]);

  return (
    <main className="container-center space-y-6 text-center">
      {/* Visual Alert Icon */}
      <div className="flex justify-center">
        <div className="rounded-full bg-yellow-100 p-4 dark:bg-yellow-900/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-(--accent)"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>
      </div>

      {/* Content Card */}
      <div className="card card-sm card-interactive border-t-4 border-(--accent)">
        <h1 className="mb-2 text-3xl font-bold">Algo deu errado</h1>
        <p className="mb-6 opacity-80">
          Ocorreu um erro inesperado. Tente novamente ou volte para a área de
          estudos.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="button-primary"
          >
            Tentar novamente
          </button>
          <Link
            href="/dashboard"
            className="text-sm font-medium opacity-70 hover:underline"
          >
            Voltar para área de estudos
          </Link>
        </div>
      </div>

      {error.digest && (
        <p className="text-xs opacity-50">Código do erro: {error.digest}</p>
      )}
    </main>
  );
}
