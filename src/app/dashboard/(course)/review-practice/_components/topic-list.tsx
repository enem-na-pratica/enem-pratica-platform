import type { TopicProgress } from '@/src/web/api';

export type ColumnData = {
  topics: TopicProgress[];
  isLoading: boolean;
};

function EmptyColumn() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center opacity-50 select-none">
      <p className="mb-3 text-4xl">🎉</p>
      <p className="text-sm font-semibold">
        Nenhum assunto aqui. Continue assim!
      </p>
    </div>
  );
}

export function TopicList({ topics }: { topics: TopicProgress[] }) {
  if (topics.length === 0) {
    return <EmptyColumn />;
  }

  return (
    <ul className="divide-y divide-(--foreground)/10">
      {topics.map((tp) => (
        <li
          key={tp.topic.id}
          className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-(--foreground)/5"
        >
          <span className="w-5 shrink-0 text-right font-mono text-xs opacity-30">
            {tp.topic.position}
          </span>
          <span className="text-sm leading-snug font-medium">
            {tp.topic.title}
          </span>
        </li>
      ))}
    </ul>
  );
}
