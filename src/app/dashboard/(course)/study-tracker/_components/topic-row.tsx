import { ChevronDown, LoaderCircle } from 'lucide-react';

import type { TopicProgress } from '@/src/web/api';
import { TOPIC_STATUS_LABELS, type TopicStatus } from '@/src/web/config';

import { useTopicStatus } from '../_hooks/use-topic-status';
import { STATUS_BADGE, STATUS_STYLES } from './status-config';

type TopicRowProps = {
  topicProgress: TopicProgress;
  onStatusChange: (topicId: string, newStatus: TopicStatus) => Promise<void>;
};

export function TopicRow({ topicProgress, onStatusChange }: TopicRowProps) {
  const { topic, progress } = topicProgress;
  const { currentStatus, isUpdating, error, justSaved, handleChange } =
    useTopicStatus({
      initialStatus: progress?.status ?? null,
      topicId: topic.id,
      onStatusChange,
    });

  return (
    <div
      className={`card card-interactive flex flex-col justify-between gap-3 border-l-4 border-(--accent) py-4 transition-all duration-300 sm:flex-row sm:items-center ${
        justSaved ? 'ring-1 ring-green-500/40' : ''
      }`}
    >
      <TopicInfo
        topic={topic}
        currentStatus={currentStatus}
      />

      <div className="flex shrink-0 flex-col items-end gap-1">
        <TopicStatusSelect
          currentStatus={currentStatus}
          isUpdating={isUpdating}
          error={error}
          justSaved={justSaved}
          onChange={handleChange}
        />
        <StatusFeedback
          error={error}
          justSaved={justSaved}
        />
      </div>
    </div>
  );
}

type TopicInfoProps = {
  topic: TopicProgress['topic'];
  currentStatus: TopicStatus | null;
};

function TopicInfo({ topic, currentStatus }: TopicInfoProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <span className="w-5 shrink-0 text-right font-mono text-xs opacity-30">
        {topic.position}
      </span>
      <div className="min-w-0">
        <p
          className="truncate text-sm font-semibold"
          title={topic.title}
        >
          {topic.title}
        </p>
        <TopicBadge status={currentStatus} />
      </div>
    </div>
  );
}

function TopicBadge({ status }: { status: TopicStatus | null }) {
  if (!status) return null;

  const badge = STATUS_BADGE[status];
  if (!badge) return null;

  return (
    <span
      className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${badge.bg}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${badge.dot}`} />
      <span className={STATUS_STYLES[status]}>
        {TOPIC_STATUS_LABELS[status]}
      </span>
    </span>
  );
}

type TopicStatusSelectProps = {
  currentStatus: TopicStatus | null;
  isUpdating: boolean;
  error: string | null;
  justSaved: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

function TopicStatusSelect({
  currentStatus,
  isUpdating,
  error,
  justSaved,
  onChange,
}: TopicStatusSelectProps) {
  const selectStyles = `input appearance-none pr-8 text-sm font-semibold transition-all duration-200 min-w-40 ${
    isUpdating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
  } ${error ? 'animate-shake border-(--error) ring-1 ring-(--error)' : ''} ${
    justSaved ? 'border-green-500/50' : ''
  }`;

  return (
    <div className="relative">
      <select
        value={currentStatus ?? ''}
        onChange={onChange}
        disabled={isUpdating}
        className={selectStyles}
      >
        <TopicOptions currentStatus={currentStatus} />
      </select>
      <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs opacity-50">
        {isUpdating ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </span>
    </div>
  );
}

function TopicOptions({
  currentStatus,
}: {
  currentStatus: TopicStatus | null;
}) {
  return (
    <>
      {currentStatus === null && (
        <option
          value=""
          disabled
        >
          — Selecionar —
        </option>
      )}
      {Object.entries(TOPIC_STATUS_LABELS).map(([key, label]) => (
        <option
          key={key}
          value={key}
        >
          {label}
        </option>
      ))}
    </>
  );
}

function StatusFeedback({
  error,
  justSaved,
}: {
  error: string | null;
  justSaved: boolean;
}) {
  return (
    <>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          error ? 'max-h-6 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-[10px] font-medium text-(--error) italic">{error}</p>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          justSaved ? 'max-h-6 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-[10px] font-bold text-green-500">✓ Salvo</p>
      </div>
    </>
  );
}
