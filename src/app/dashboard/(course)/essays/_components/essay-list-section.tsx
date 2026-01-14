import { EssayItem } from "./essay-item";

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

export function EssayListSection({ essays }: { essays: Essay[] }) {
  return (
    <section className="grid grid-cols-1 gap-4">
      {essays.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <p>Nenhuma redação cadastrada ainda.</p>
        </div>
      ) : (
        essays.map((essay) => <EssayItem key={essay.id} essay={essay} />)
      )}
    </section>
  );
}
