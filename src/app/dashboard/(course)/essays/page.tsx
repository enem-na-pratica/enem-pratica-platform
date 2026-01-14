import Link from "next/link";
import { Header } from "@/src/ui/components";
import {
  StatsSection,
  EssayForm,
  EssayListSection,
} from "@/src/app/dashboard/(course)/essays/_components";

// Definition of Types
type CompetencyKey = "c1" | "c2" | "c3" | "c4" | "c5";

type EssayGrades = {
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
  total: number;
};

type Essay = {
  id: string;
  authorId: string;
  theme: string;
  grades: EssayGrades;
  createdAt: Date;
};

type EssaySummary = {
  totalCount: number;
  globalAverage: number;
  averagesPerCompetency: Record<CompetencyKey, number>;
};

type EssaysResponse = {
  summary: EssaySummary;
  data: Essay[];
};

// 2. Raw Data
const RAW_ESSAYS = [
  {
    id: "1",
    authorId: "user-123",
    theme: "Os desafios da inteligência artificial na educação",
    c1: 160,
    c2: 180,
    c3: 160,
    c4: 200,
    c5: 180,
    createdAt: new Date("2024-05-10T14:00:00"),
  },
  {
    id: "2",
    authorId: "user-123",
    theme: "Caminhos para combater a intolerância religiosa",
    c1: 140,
    c2: 120,
    c3: 120,
    c4: 160,
    c5: 100,
    createdAt: new Date("2024-05-15T09:30:00"),
  },
  {
    id: "3",
    authorId: "user-123",
    theme: "A democratização do acesso ao cinema no Brasil",
    c1: 180,
    c2: 200,
    c3: 180,
    c4: 180,
    c5: 200,
    createdAt: new Date("2024-06-01T16:45:00"),
  },
];

// 3. Transformation to the new Essay[] structure
const formattedEssays: Essay[] = RAW_ESSAYS.map((item) => {
  const total = item.c1 + item.c2 + item.c3 + item.c4 + item.c5;
  return {
    id: item.id,
    authorId: item.authorId,
    theme: item.theme,
    createdAt: item.createdAt,
    grades: {
      c1: item.c1,
      c2: item.c2,
      c3: item.c3,
      c4: item.c4,
      c5: item.c5,
      total,
    },
  };
});

// 4. Calculation of Summaries
const count = formattedEssays.length;

const averagesPerCompetency: Record<CompetencyKey, number> = {
  c1: formattedEssays.reduce((acc, curr) => acc + curr.grades.c1, 0) / count,
  c2: formattedEssays.reduce((acc, curr) => acc + curr.grades.c2, 0) / count,
  c3: formattedEssays.reduce((acc, curr) => acc + curr.grades.c3, 0) / count,
  c4: formattedEssays.reduce((acc, curr) => acc + curr.grades.c4, 0) / count,
  c5: formattedEssays.reduce((acc, curr) => acc + curr.grades.c5, 0) / count,
};

const globalAverage =
  formattedEssays.reduce((acc, curr) => acc + curr.grades.total, 0) / count;

// 5. Full Mock
const MOCK_COMPLETE: EssaysResponse = {
  summary: {
    totalCount: count,
    globalAverage: Number(globalAverage.toFixed(2)),
    averagesPerCompetency,
  },
  data: formattedEssays,
};

export default async function EssayPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const isFormOpen = params.showForm === "true";

  const essays = MOCK_COMPLETE.data;
  const summary = MOCK_COMPLETE.summary;

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
        {essays.length > 0 && <StatsSection summary={summary} />}

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
