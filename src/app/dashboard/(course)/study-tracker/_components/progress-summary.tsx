import type { TopicProgress } from '@/src/web/api';

export function ProgressSummary({ topics }: { topics: TopicProgress[] }) {
  const total = topics.length;
  const comprehended = topics.filter(
    (t) => t.progress?.status === 'COMPREHENDED',
  ).length;
  const practice = topics.filter(
    (t) => t.progress?.status === 'PRACTICE',
  ).length;
  const review = topics.filter((t) => t.progress?.status === 'REVIEW').length;
  const pending = total - comprehended - practice - review;

  const pct = (n: number) =>
    total > 0 ? `${((n / total) * 100).toFixed(0)}%` : '0%';

  return (
    <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-sm font-bold tracking-widest uppercase opacity-60">
          Progresso da Matéria
        </h3>
        <span className="font-mono text-xs opacity-40">
          {comprehended}/{total} concluídos
        </span>
      </div>
      {/* Bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-(--foreground)/10">
        <div
          className="h-full bg-green-500 transition-all duration-700 ease-out"
          style={{ width: pct(comprehended) }}
          title={`Compreendido: ${comprehended}`}
        />
        <div
          className="h-full bg-yellow-500 transition-all duration-700 ease-out"
          style={{ width: pct(practice) }}
          title={`Praticar: ${practice}`}
        />
        <div
          className="h-full bg-red-500 transition-all duration-700 ease-out"
          style={{ width: pct(review) }}
          title={`Revisar: ${review}`}
        />
      </div>
      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4">
        {[
          { label: 'Compreendido', count: comprehended, color: 'bg-green-500' },
          { label: 'Praticar', count: practice, color: 'bg-yellow-500' },
          { label: 'Revisar', count: review, color: 'bg-red-500' },
          { label: 'Pendente', count: pending, color: 'bg-(--foreground)/20' },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-1.5"
          >
            <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
            <span className="text-xs opacity-60">{item.label}</span>
            <span className="text-xs font-bold">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
