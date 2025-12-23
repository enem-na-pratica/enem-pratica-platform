import Link from "next/link";

export default function AccessDenied() {
  return (
    <main className="container-center text-center space-y-6">
      {/* Visual Alert Icon */}
      <div className="flex justify-center">
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-(--error)"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      {/* Text Content */}
      <div className="card card-interactive border-t-4 border-(--error)">
        <h1 className="text-3xl font-bold mb-2">Acesso Restrito</h1>
        <p className="opacity-80 mb-6">
          Ops! Parece que você não tem permissão para acessar esta página ou sua
          sessão expirou.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/login" className="button-primary text-center">
            Fazer Login
          </Link>

          <Link
            href="/"
            className="text-sm font-medium hover:underline opacity-70"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>

      <p className="text-xs opacity-50">Código do erro: 403 Forbidden</p>
    </main>
  );
}
