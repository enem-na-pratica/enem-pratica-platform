import Link from "next/link";

export default function NotFound() {
  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center px-4 bg-(--background)">
      {/* Background Visual Element */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <span className="text-[20rem] font-black">404</span>
      </div>

      {/* Content Card */}
      <div className="card card-sm card-interactive border-t-4 border-(--accent) text-center relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-(--accent)/20 p-4 rounded-full">
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold mb-2">Página Perdida</h1>
        <p className="opacity-80 mb-8">
          Ops! O conteúdo que você procura não foi encontrado ou foi movido para um
          novo endereço.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/dashboard" className="button-primary text-center">
            Voltar para área de estudos
          </Link>

          <p className="text-xs opacity-50 mt-4">
            Dica: Verifique se a URL digitada está correta.
          </p>
        </div>
      </div>

      <footer className="absolute bottom-6 opacity-40 text-xs">
        © 2025 ENEM na Prática
      </footer>
    </main>
  );
}
