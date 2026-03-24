import { EssayStatistics } from '@/src/web/api';

export function StatsSection({ statistics }: { statistics: EssayStatistics }) {
  function getBarColor(avg: number) {
    if (avg <= 80) return 'hsl(0, 84%, 60%)'; // Red (Insufficient)
    if (avg < 120) return 'hsl(35, 90%, 55%)'; // Orange/Amber (Regular/Medium)
    if (avg < 160) return 'hsl(50, 90%, 50%)'; // Yellow (Decent — attention to achieving excellence)
    if (avg < 180) return 'hsl(100, 70%, 45%)'; // Lime Green (Very Good)
    return 'hsl(140, 70%, 40%)'; // Strong Green (Excellent/Top Grade)
  }
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-4 duration-500 md:grid-cols-2 lg:grid-cols-4">
      {/* General average */}
      <div className="card group relative flex flex-col items-center justify-center overflow-hidden bg-(--accent) text-(--foreground) lg:col-span-2">
        <div className="absolute top-0 right-0 rotate-12 p-4 text-6xl opacity-10">
          📊
        </div>
        <span className="text-sm font-bold tracking-widest uppercase opacity-80">
          Média Geral
        </span>
        <strong className="mt-2 text-6xl font-black">
          {statistics.globalAverage.toFixed(0)}
        </strong>
        <span className="mt-2 rounded-full bg-black/10 px-3 py-1 text-xs font-medium">
          Baseado em {statistics.totalCount} redações
        </span>
      </div>

      {/* Competency-based media */}
      <div className="card flex flex-col justify-between p-5 lg:col-span-2">
        <h3 className="mb-3 text-sm font-bold uppercase opacity-60">
          Média por Competência
        </h3>
        <div className="space-y-3">
          {Object.entries(statistics.averagesPerCompetency).map(
            ([competency, avg], index) => {
              const barColor = getBarColor(avg);

              return (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <span className="w-6 font-mono text-xs uppercase opacity-50">
                    {competency}
                  </span>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-(--foreground)/10">
                    <div
                      className="h-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${(avg / 200) * 100}%`,
                        backgroundColor: barColor,
                        boxShadow:
                          avg >= 160 ? `0 0 10px ${barColor}55` : 'none',
                      }}
                    />
                  </div>
                  <span
                    className="w-8 text-right text-xs font-bold"
                    style={{ color: barColor }}
                  >
                    {avg.toFixed(0)}
                  </span>
                </div>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
