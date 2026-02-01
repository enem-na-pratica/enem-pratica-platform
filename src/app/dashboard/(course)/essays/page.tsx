import Link from "next/link";
import { Header } from "@/src/web/components";
import {
  StatsSection,
  EssayForm,
  EssayListSection,
} from "@/src/app/dashboard/(course)/essays/_components";
import { makeEssayService } from "@/src/web/api";

export default async function EssayPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const isFormOpen = params.showForm === "true";

  const { essays, statistics } =
    await makeEssayService().listUserEssaysStatistics("me");

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground) pb-20 transition-colors duration-500">
      <Header>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" aria-label="Voltar para Dashboard">
            <BackArrow />
          </Link>
          <h1 className="text-xl font-bold tracking-tight">
            Minhas <span className="text-(--accent)">Redações</span>
          </h1>
        </div>
      </Header>

      <main className="w-full max-w-6xl mx-auto py-8 space-y-8 px-4">
        {/* --- Statistics section --- */}
        {essays.length > 0 && <StatsSection statistics={statistics} />}

        <hr className="border-(--foreground)/10" />

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Histórico</h2>
          <Link
            href={isFormOpen ? "?" : "?showForm=true"}
            className="button-primary flex items-center gap-2 shadow-lg shadow-(--accent)/20"
          >
            <span>{isFormOpen ? "Cancelar" : "Nova Redação"}</span>
            {!isFormOpen && <span>+</span>}
          </Link>
        </div>

        {/* --- Form for registering new essays. --- */}
        {isFormOpen && <EssayForm />}

        {/* --- Essay listing section --- */}
        <EssayListSection essays={essays} />
      </main>
    </div>
  );
}

// Back arrow icon
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
