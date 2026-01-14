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

export function StatsSection({ summary }: { summary: EssaySummary }) {
  function getBarColor(avg: number) {
    if (avg <= 80) return "hsl(0, 84%, 60%)"; // Red (Insufficient)
    if (avg < 120) return "hsl(35, 90%, 55%)"; // Orange/Amber (Regular/Medium)
    if (avg < 160) return "hsl(50, 90%, 50%)"; // Yellow (Decent — attention to achieving excellence)
    if (avg < 180) return "hsl(100, 70%, 45%)"; // Lime Green (Very Good)
    return "hsl(140, 70%, 40%)"; // Strong Green (Excellent/Top Grade)
  }
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* General average */}
      <div className="card bg-(--accent) text-(--foreground) lg:col-span-2 flex flex-col justify-center items-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl rotate-12">
          📊
        </div>
        <span className="text-sm font-bold uppercase tracking-widest opacity-80">
          Média Geral
        </span>
        <strong className="text-6xl font-black mt-2">
          {summary.globalAverage.toFixed(0)}
        </strong>
        <span className="text-xs font-medium mt-2 bg-black/10 px-3 py-1 rounded-full">
          Baseado em {summary.totalCount} redações
        </span>
      </div>

      {/* Competency-based media */}
      <div className="card lg:col-span-2 p-5 flex flex-col justify-between">
        <h3 className="text-sm font-bold opacity-60 mb-3 uppercase">
          Média por Competência
        </h3>
        <div className="space-y-3">
          {Object.entries(summary.averagesPerCompetency).map(
            ([competency, avg], index) => {
              const barColor = getBarColor(avg);

              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs font-mono w-6 opacity-50 uppercase">
                    {competency}
                  </span>

                  <div className="flex-1 h-2 bg-(--foreground)/10 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${(avg / 200) * 100}%`,
                        backgroundColor: barColor,
                        boxShadow:
                          avg >= 160 ? `0 0 10px ${barColor}55` : "none",
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-bold w-8 text-right"
                    style={{ color: barColor }}
                  >
                    {avg.toFixed(0)}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
