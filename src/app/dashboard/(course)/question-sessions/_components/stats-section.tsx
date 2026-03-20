import { QuestionSessionStatistics } from '@/src/web/api';

export function StatsSection({
  statistics,
}: {
  statistics: QuestionSessionStatistics;
}) {
  const accuracyColor = (acc: number) => {
    if (acc < 40) return 'hsl(0, 84%, 60%)';
    if (acc < 60) return 'hsl(35, 90%, 55%)';
    if (acc < 75) return 'hsl(50, 90%, 50%)';
    if (acc < 90) return 'hsl(100, 70%, 45%)';
    return 'hsl(140, 70%, 40%)';
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-4 duration-500 md:grid-cols-2 lg:grid-cols-4">
      {/* Overall accuracy — hero card */}
      <div className="card group relative flex flex-col items-center justify-center overflow-hidden bg-(--accent) text-(--foreground) lg:col-span-2">
        <div className="absolute top-0 right-0 rotate-12 p-4 text-6xl opacity-10">
          🎯
        </div>
        <span className="text-sm font-bold tracking-widest uppercase opacity-80">
          Taxa de Acertos
        </span>
        <strong className="mt-2 text-6xl font-black">
          {(statistics.overallAccuracy * 100).toFixed(0)}%
        </strong>
        <span className="mt-2 rounded-full bg-black/10 px-3 py-1 text-xs font-medium">
          {statistics.totalCorrect} acertos em {statistics.totalQuestions}{' '}
          questões
        </span>
      </div>

      {/* Weekly progress */}
      <div className="card flex flex-col justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📅</span>
          <h3 className="text-sm font-bold tracking-widest uppercase opacity-60">
            Esta Semana
          </h3>
        </div>
        <div>
          <p className="text-4xl font-black">
            {(statistics.weeklyProgress.accuracy * 100).toFixed(0)}
            <span className="text-lg font-bold opacity-60">%</span>
          </p>
          <p className="mt-1 text-xs opacity-50">
            {statistics.weeklyProgress.totalQuestions} questões respondidas
          </p>
        </div>
        {/* Mini accuracy bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--foreground)/10">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${statistics.weeklyProgress.accuracy * 100}%`,
              backgroundColor: accuracyColor(
                statistics.weeklyProgress.accuracy * 100,
              ),
            }}
          />
        </div>
      </div>

      {/* Right column: streak + pending reviews */}
      <div className="flex flex-col gap-4">
        {/* Study streak */}
        <div className="card flex flex-1 flex-col justify-center">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h3 className="text-sm font-bold tracking-widest uppercase opacity-60">
              Sequência
            </h3>
          </div>
          <p className="text-3xl font-black">
            {statistics.studyStreak}
            <span className="ml-1 text-sm font-semibold opacity-50">dias</span>
          </p>
        </div>

        {/* Pending reviews */}
        <div
          className="card relative flex flex-1 flex-col justify-center overflow-hidden"
          style={
            statistics.pendingReviewsCount > 0
              ? { borderLeft: '3px solid var(--error)' }
              : { borderLeft: '3px solid var(--success)' }
          }
        >
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h3 className="text-sm font-bold tracking-widest uppercase opacity-60">
              Revisar
            </h3>
          </div>
          <p
            className="text-3xl font-black"
            style={{
              color:
                statistics.pendingReviewsCount > 0
                  ? 'var(--error)'
                  : 'var(--success)',
            }}
          >
            {statistics.pendingReviewsCount}
          </p>
          <p className="mt-0.5 text-xs opacity-40">sessões pendentes</p>
        </div>
      </div>

      {/* Overall totals row */}
      <div className="card flex flex-wrap items-center justify-around gap-6 py-4 lg:col-span-4">
        {[
          {
            label: 'Total de Sessões',
            value: statistics.totalSessions,
            icon: '📝',
          },
          {
            label: 'Total de Questões',
            value: statistics.totalQuestions,
            icon: '❓',
          },
          {
            label: 'Total de Acertos',
            value: statistics.totalCorrect,
            icon: '✅',
          },
          {
            label: 'Total de Erros',
            value: statistics.totalQuestions - statistics.totalCorrect,
            icon: '❌',
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-1 text-center"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-2xl font-black">{item.value}</span>
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
