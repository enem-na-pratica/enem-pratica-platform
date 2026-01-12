"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/src/ui/components/theme-toggle";
import { LogoutButton } from "@/src/ui/components/logout-button";

interface Essay {
  id: string;
  authorId: string;
  theme: string;
  competency1: number;
  competency2: number;
  competency3: number;
  competency4: number;
  competency5: number;
  createdAt: Date;
}

const MOCK_DATA: Essay[] = [
  {
    id: "1",
    authorId: "user-123",
    theme: "Os desafios da inteligência artificial na educação",
    competency1: 160,
    competency2: 180,
    competency3: 160,
    competency4: 200,
    competency5: 180,
    createdAt: new Date("2024-05-10T14:00:00"),
  },
  {
    id: "2",
    authorId: "user-123",
    theme: "Caminhos para combater a intolerância religiosa",
    competency1: 140,
    competency2: 120,
    competency3: 120,
    competency4: 160,
    competency5: 100,
    createdAt: new Date("2024-05-15T09:30:00"),
  },
  {
    id: "3",
    authorId: "user-123",
    theme: "A democratização do acesso ao cinema no Brasil",
    competency1: 180,
    competency2: 200,
    competency3: 180,
    competency4: 180,
    competency5: 200,
    createdAt: new Date("2024-06-01T16:45:00"),
  },
];

export default function EssayPage() {
  const [essays, setEssays] = useState<Essay[]>(MOCK_DATA);
  const [showForm, setShowForm] = useState(false);

  const [newTheme, setNewTheme] = useState("");
  const [scores, setScores] = useState({
    c1: 120,
    c2: 120,
    c3: 120,
    c4: 120,
    c5: 120,
  });

  const stats = useMemo(() => {
    const totalEssays = essays.length;
    if (totalEssays === 0) return null;

    const sum = (key: keyof Essay) =>
      essays.reduce((acc, curr) => acc + (curr[key] as number), 0);

    const avgC1 = sum("competency1") / totalEssays;
    const avgC2 = sum("competency2") / totalEssays;
    const avgC3 = sum("competency3") / totalEssays;
    const avgC4 = sum("competency4") / totalEssays;
    const avgC5 = sum("competency5") / totalEssays;

    const totalAvg = (avgC1 + avgC2 + avgC3 + avgC4 + avgC5).toFixed(0);

    return {
      count: totalEssays,
      averages: [avgC1, avgC2, avgC3, avgC4, avgC5],
      totalScoreAvg: totalAvg,
    };
  }, [essays]);

  // --- Handlers ---
  const handleAddEssay = (e: React.FormEvent) => {
    e.preventDefault();

    const newEssay: Essay = {
      id: Math.random().toString(36).substr(2, 9),
      authorId: "user-123",
      theme: newTheme || "Tema sem título",
      competency1: Number(scores.c1),
      competency2: Number(scores.c2),
      competency3: Number(scores.c3),
      competency4: Number(scores.c4),
      competency5: Number(scores.c5),
      createdAt: new Date(),
    };

    setEssays([newEssay, ...essays]);
    setShowForm(false);
    setNewTheme("");
    setScores({ c1: 120, c2: 120, c3: 120, c4: 120, c5: 120 });
  };

  const handleScoreChange = (key: string, value: string) => {
    setScores((prev) => ({ ...prev, [key]: Number(value) }));
  };

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground) pb-20 transition-colors duration-500">
      {/* Header Customizado */}
      <header className="sticky top-0 z-10 bg-(--background)/80 backdrop-blur-md border-b border-(--foreground)/10">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" aria-label="Voltar para Dashboard">
              <BackArrow />
            </Link>
            <h1 className="text-xl font-bold tracking-tight">
              Minhas <span className="text-(--accent)">Redações</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden sm:block">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* --- Seção de Estatísticas --- */}
        {stats && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Card Principal: Média Geral */}
            <div className="card bg-(--accent) text-(--foreground) lg:col-span-2 flex flex-col justify-center items-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl rotate-12">
                📊
              </div>
              <span className="text-sm font-bold uppercase tracking-widest opacity-80">
                Média Geral
              </span>
              <strong className="text-6xl font-black mt-2">
                {stats.totalScoreAvg}
              </strong>
              <span className="text-xs font-medium mt-2 bg-black/10 px-3 py-1 rounded-full">
                Baseado em {stats.count} redações
              </span>
            </div>

            {/* Competências (Médias Individuais) */}
            <div className="card lg:col-span-2 p-5 flex flex-col justify-between">
              <h3 className="text-sm font-bold opacity-60 mb-3 uppercase">
                Média por Competência
              </h3>
              <div className="space-y-3">
                {stats.averages.map((avg, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs font-mono w-6 opacity-50">
                      C{index + 1}
                    </span>
                    <div className="flex-1 h-2 bg-(--foreground)/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-(--success)"
                        style={{ width: `${(avg / 200) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold w-8 text-right">
                      {avg.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <hr className="border-(--foreground)/10" />

        {/* --- Botão de Ação --- */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Histórico</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="button-primary flex items-center gap-2 shadow-lg shadow-(--accent)/20"
          >
            <span>{showForm ? "Cancelar" : "Nova Redação"}</span>
            {!showForm && <span>+</span>}
          </button>
        </div>

        {/* --- Formulário de Cadastro --- */}
        {showForm && (
          <form
            onSubmit={handleAddEssay}
            className="card border-2 border-(--accent) animate-in zoom-in-95 duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-6 items-end">
              {/* Tema - Ocupa o espaço disponível */}
              <div className="flex-1 w-full">
                <label className="text-sm font-bold opacity-70 mb-1 block">
                  Tema da Redação
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Os estigmas associados..."
                  className="input"
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                />
              </div>

              {/* Notas e Botão - Agrupados horizontalmente */}
              <div className="flex flex-wrap sm:flex-nowrap items-end gap-4 w-full lg:w-auto">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="w-14 sm:w-16">
                      <label className="text-[10px] font-bold opacity-60 mb-1 block uppercase text-center">
                        C{num}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        step="20"
                        required
                        className="input text-center font-mono font-bold p-1"
                        value={scores[`c${num}` as keyof typeof scores]}
                        onChange={(e) =>
                          handleScoreChange(`c${num}`, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="button-primary whitespace-nowrap h-[42px]"
                >
                  Salvar
                </button>
              </div>
            </div>
          </form>
        )}

        {/* --- Listagem --- */}
        <section className="grid grid-cols-1 gap-4">
          {essays.length === 0 ? (
            <div className="text-center py-20 opacity-50">
              <p>Nenhuma redação cadastrada ainda.</p>
            </div>
          ) : (
            essays.map((essay) => (
              <div
                key={essay.id}
                className="card card-interactive flex flex-col md:flex-row md:items-center gap-4 md:gap-8 border-l-4 border-(--accent) py-4"
              >
                {/* Data e Título */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] opacity-50 font-mono uppercase tracking-tighter">
                    {essay.createdAt.toLocaleDateString("pt-BR")}
                  </span>
                  <h3
                    className="text-base font-bold truncate"
                    title={essay.theme}
                  >
                    {essay.theme}
                  </h3>
                </div>

                {/* Competências - Distribuição horizontal discreta */}
                <div className="hidden lg:flex items-center gap-3 px-4 border-x border-(--foreground)/5">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="text-center">
                      <p className="text-[9px] opacity-40 font-bold">C{num}</p>
                      <p className="text-xs font-mono font-bold">
                        {essay[`competency${num}` as keyof Essay] as number}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Nota Total */}
                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="text-right">
                    <span className="block text-[10px] uppercase font-bold opacity-40 leading-none">
                      Total
                    </span>
                    <span className="text-2xl font-black text-(--accent)">
                      {essay.competency1 +
                        essay.competency2 +
                        essay.competency3 +
                        essay.competency4 +
                        essay.competency5}
                    </span>
                  </div>

                  {/* Botão de ação opcional ou apenas um ícone de "chevron" */}
                  <div className="opacity-20 hover:opacity-100 transition-opacity cursor-pointer">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

// Ícone de seta para voltar
function BackArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className="w-6 h-6 hover:text-(--accent) transition-colors"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
      />
    </svg>
  );
}
