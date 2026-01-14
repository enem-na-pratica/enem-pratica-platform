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

const COMPETENCIES: CompetencyKey[] = ["c1", "c2", "c3", "c4", "c5"];

export function EssayItem({ essay }: { essay: Essay }) {
  return (
    <div
      key={essay.id}
      className="card card-interactive flex flex-col md:flex-row md:items-center gap-4 md:gap-8 border-l-4 border-(--accent) py-4"
    >
      <div className="flex-1 min-w-0">
        <span className="text-[10px] opacity-50 font-mono uppercase tracking-tighter">
          {essay.createdAt.toLocaleDateString("pt-BR")}
        </span>
        <h3 className="text-base font-bold truncate" title={essay.theme}>
          {essay.theme}
        </h3>
      </div>

      <div className="hidden lg:flex items-center gap-3 px-4 border-x border-(--foreground)/5">
        {COMPETENCIES.map((key) => (
          <div key={key} className="text-center">
            <p className="text-[9px] opacity-40 font-bold uppercase">{key}</p>
            <p className="text-xs font-mono font-bold">{essay.grades[key]}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between md:justify-end gap-6">
        <div className="text-right">
          <span className="block text-[10px] uppercase font-bold opacity-40 leading-none">
            Total
          </span>
          <span className="text-2xl font-black text-(--accent)">
            {essay.grades.total}
          </span>
        </div>
      </div>
    </div>
  );
}
