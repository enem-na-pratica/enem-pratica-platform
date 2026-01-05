import { FeatureCard } from "@/src/app/_components";
import { ThemeToggle } from "@/src/ui/components/theme-toggle";

export default function Home() {
  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main className="w-full min-h-screen flex flex-col items-center">
        {/* --- HERO SECTION --- */}
        <section className="w-full max-w-5xl px-6 py-20 flex flex-col items-center text-center">
          <div className="mb-6 inline-block px-4 py-1 rounded-full border border-(--accent) text-(--accent) text-sm font-medium">
            Aprovação com Estratégia
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Domine o ENEM com <br />
            <span className="text-(--accent)">Prática e Direcionamento</span>
          </h1>
          <p className="text-lg opacity-80 max-w-2xl mb-10">
            Transformamos sua rotina de estudos com cronogramas inteligentes,
            foco no que realmente cai e suporte de quem entende o caminho da
            aprovação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="button-primary text-lg px-8 py-4">
              Quero ser aprovado
            </button>
            <button className="border-2 border-(--foreground) px-8 py-4 rounded-md font-semibold hover:bg-(--foreground) hover:text-(--background) transition-all cursor-pointer">
              Conhecer Metodologia
            </button>
          </div>
        </section>

        {/* --- FEATURE SECTION --- */}
        <section className="w-full bg-(--card-background) py-16 flex justify-center">
          <div className="max-w-5xl w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
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
        <section className="py-20 px-6 text-center">
          <div className="card card-interactive max-w-3xl mx-auto border border-(--accent)">
            <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
            <p className="mb-8 opacity-90">
              Junte-se a milhares de alunos que estão simplificando a jornada
              para a universidade.
            </p>
            <button className="button-primary w-full sm:w-auto px-12 py-3">
              Garantir minha vaga
            </button>
          </div>
        </section>
      </main>
      <footer className="py-10 opacity-60 text-sm text-center">
        © 2025 ENEM na Prática. Todos os direitos reservados.
      </footer>
    </>
  );
}
