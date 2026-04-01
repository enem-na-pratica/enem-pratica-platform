import { cookies } from 'next/headers';
import Link from 'next/link';

import { FeatureCard } from '@/src/app/_components';
import { ThemeToggle } from '@/src/web/components';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  const isAuthenticated = !!token;

  return (
    <>
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        {isAuthenticated && (
          <Link
            href="/dashboard"
            className="rounded-md px-4 py-2 text-sm font-semibold transition-all hover:opacity-70"
          >
            Meu Dashboard
          </Link>
        )}
        <ThemeToggle />
      </div>

      <main className="flex min-h-screen w-full flex-col items-center">
        {/* --- HERO SECTION --- */}
        <section className="flex w-full max-w-5xl flex-col items-center px-6 py-20 text-center">
          <div className="mb-6 inline-block rounded-full border border-(--accent) px-4 py-1 text-sm font-medium text-(--accent)">
            Aprovação com Estratégia
          </div>

          <h1 className="mb-6 text-4xl leading-tight font-extrabold md:text-6xl">
            Domine o ENEM com <br />
            <span className="text-(--accent)">Prática e Direcionamento</span>
          </h1>

          <p className="mb-10 max-w-2xl text-lg opacity-80">
            Transformamos sua rotina de estudos com cronogramas inteligentes,
            foco no que realmente cai e suporte de quem entende o caminho da
            aprovação.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Botão principal: Dashboard se logado, Login se não logado */}
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="button-primary flex items-center justify-center px-8 py-4 text-center text-lg"
              >
                Ir para Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="button-primary flex items-center justify-center px-8 py-4 text-center text-lg"
              >
                Fazer Login
              </Link>
            )}

            {/* Botão de metodologia: desabilitado por enquanto */}
            <button
              disabled
              title="Página de metodologia em desenvolvimento"
              className="cursor-not-allowed rounded-md border-2 border-(--foreground) px-8 py-4 font-semibold opacity-50 transition-all hover:opacity-50"
            >
              Conhecer Metodologia
            </button>
          </div>

          {!isAuthenticated && (
            <div className="mt-6 flex max-w-md items-center gap-2 rounded-lg border border-(--foreground)/10 bg-(--foreground)/5 px-4 py-2 text-sm">
              <span>💡</span>
              <p className="opacity-90">
                Faça login para acessar seu <strong>dashboard</strong> e
                cronogramas personalizados.
              </p>
            </div>
          )}

          {isAuthenticated && (
            <div className="mt-6 flex max-w-md items-center gap-2 rounded-lg border border-(--accent)/30 bg-(--accent)/10 px-4 py-2 text-sm text-(--foreground)">
              <span className="text-(--accent)">✅</span>
              <p className="font-medium">
                Você está autenticado! Pronto para continuar sua jornada?
              </p>
            </div>
          )}
        </section>

        {/* --- FEATURE SECTION --- */}
        <section className="flex w-full justify-center bg-(--card-background) py-16">
          <div className="grid w-full max-w-5xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
            <FeatureCard
              title="Cronograma Personalizado"
              desc="Estude o que importa, no seu ritmo, sem perder tempo com o que não cai."
              icon="📅"
            />
            <FeatureCard
              title="Foco em Prática"
              desc="Resolução de questões comentadas e simulados focados no TRI."
              icon="✍️"
            />
            <FeatureCard
              title="Suporte Individual"
              desc="Tire dúvidas e ajuste sua rota com mentores experientes."
              icon="🚀"
            />
          </div>
        </section>

        {/* --- CTA FINAL --- */}
        <section className="px-6 py-20 text-center">
          <div className="card card-interactive mx-auto max-w-3xl border border-(--accent)">
            <h2 className="mb-4 text-3xl font-bold">
              {isAuthenticated ? 'Bem-vindo de volta!' : 'Pronto para começar?'}
            </h2>
            <p className="mb-8 opacity-90">
              {isAuthenticated
                ? 'Acesse seu dashboard para acompanhar seu progresso e estudar com inteligência.'
                : 'Junte-se a milhares de alunos que estão simplificando a jornada para a universidade.'}
            </p>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="button-primary inline-block px-12 py-3"
              >
                Ir para Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="button-primary inline-block px-12 py-3"
              >
                Fazer Login Agora
              </Link>
            )}
          </div>
        </section>
      </main>

      <footer className="py-10 text-center text-sm opacity-60">
        © 2025 ENEM na Prática. Todos os direitos reservados.
      </footer>
    </>
  );
}
