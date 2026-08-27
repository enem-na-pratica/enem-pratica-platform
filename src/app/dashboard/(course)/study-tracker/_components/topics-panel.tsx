import type { TopicProgress } from '@/src/web/api';
import type { TopicStatus } from '@/src/web/config';

import { ProgressSummary } from './progress-summary';
import { TopicRow } from './topic-row';

type TopicsPanelProps = {
  topics: TopicProgress[];
  onStatusChange: (topicId: string, newStatus: TopicStatus) => Promise<void>;
};

export function TopicsPanel({ topics, onStatusChange }: TopicsPanelProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
      {topics.length > 0 && <ProgressSummary topics={topics} />}

      <hr className="border-(--foreground)/10" />

      <div className="hidden items-center gap-3 px-4 sm:flex">
        <span className="w-5" />
        <span className="flex-1 text-xs font-bold tracking-widest uppercase opacity-40">
          Assunto
        </span>
        <span className="min-w-40 text-right text-xs font-bold tracking-widest uppercase opacity-40">
          Status
        </span>
      </div>

      <section className="grid grid-cols-1 gap-3">
        {topics.length === 0 ? (
          <div className="py-20 text-center opacity-50">
            <p>Nenhum assunto encontrado para esta matéria.</p>
          </div>
        ) : (
          topics.map((tp) => (
            <TopicRow
              key={tp.topic.id}
              topicProgress={tp}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </section>
    </div>
  );
}
