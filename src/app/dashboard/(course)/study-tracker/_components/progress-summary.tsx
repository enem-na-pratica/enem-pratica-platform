import type { TopicProgress } from '@/src/web/api';

const PERCENTAGE_MULTIPLIER = 100;

export function ProgressSummary({ topics }: { topics: TopicProgress[] }) {
  const { comprehended, legend, practice, review, total } =
    getTopicSummary(topics);

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

      <ProgressBar
        comprehended={comprehended}
        practice={practice}
        review={review}
        total={total}
      />

      <ProgressLegend legend={legend} />
    </div>
  );
}

type ProgressBarProps = {
  comprehended: number;
  practice: number;
  review: number;
  total: number;
};

function ProgressBar({
  comprehended,
  practice,
  review,
  total,
}: ProgressBarProps) {
  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-(--foreground)/10">
      <ProgressBarSegment
        count={comprehended}
        total={total}
        color="bg-green-500"
        label="Compreendido"
      />
      <ProgressBarSegment
        count={practice}
        total={total}
        color="bg-yellow-500"
        label="Praticar"
      />
      <ProgressBarSegment
        count={review}
        total={total}
        color="bg-red-500"
        label="Revisar"
      />
    </div>
  );
}

type LegendItem = {
  label: string;
  count: number;
  color: string;
};

type ProgressLegendProps = {
  legend: LegendItem[];
};

function ProgressLegend({ legend }: ProgressLegendProps) {
  return (
    <div className="mt-3 flex flex-wrap gap-4">
      {legend.map((item) => (
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
  );
}

type ProgressBarSegmentProps = {
  count: number;
  total: number;
  color: string;
  label: string;
};

function ProgressBarSegment({
  count,
  total,
  color,
  label,
}: ProgressBarSegmentProps) {
  const percentage =
    total > 0
      ? `${((count / total) * PERCENTAGE_MULTIPLIER).toFixed(0)}%`
      : '0%';

  return (
    <div
      className={`h-full ${color} transition-all duration-700 ease-out`}
      style={{ width: percentage }}
      title={`${label}: ${count}`}
    />
  );
}

function getTopicSummary(topics: TopicProgress[]) {
  const total = topics.length;
  const comprehended = topics.filter(
    (t) => t.progress?.status === 'COMPREHENDED',
  ).length;
  const practice = topics.filter(
    (t) => t.progress?.status === 'PRACTICE',
  ).length;
  const review = topics.filter((t) => t.progress?.status === 'REVIEW').length;
  const pending = total - comprehended - practice - review;

  const legend = [
    { label: 'Compreendido', count: comprehended, color: 'bg-green-500' },
    { label: 'Praticar', count: practice, color: 'bg-yellow-500' },
    { label: 'Revisar', count: review, color: 'bg-red-500' },
    { label: 'Pendente', count: pending, color: 'bg-(--foreground)/20' },
  ];

  return {
    total,
    comprehended,
    practice,
    review,
    pending,
    legend,
  };
}
