import { useRef, useState } from 'react';

import type { TopicProgress } from '@/src/web/api';
import { TOPIC_STATUS_LABELS, TopicStatus } from '@/src/web/config';

import { STATUS_BADGE, STATUS_STYLES } from '../status-config';
import { ChevronIcon, SpinnerIcon } from './icons';

export function TopicRow({
  topicProgress,
  onStatusChange,
}: {
  topicProgress: TopicProgress;
  onStatusChange: (topicId: string, newStatus: TopicStatus) => Promise<void>;
}) {
  const { topic, progress } = topicProgress;
  const [currentStatus, setCurrentStatus] = useState<TopicStatus | null>(
    progress?.status ?? null,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const prevStatusRef = useRef<TopicStatus | null>(currentStatus);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TopicStatus;
    if (!newStatus || newStatus === currentStatus) return;
    prevStatusRef.current = currentStatus;
    setCurrentStatus(newStatus);
    setIsUpdating(true);
    setError(null);
    try {
      await onStatusChange(topic.id, newStatus);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
    } catch {
      setCurrentStatus(prevStatusRef.current);
      setError('Erro ao salvar. Tente novamente.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const badge = currentStatus ? STATUS_BADGE[currentStatus] : null;

  return (
    <div
      className={`card card-interactive flex flex-col justify-between gap-3 border-l-4 border-(--accent) py-4 transition-all duration-300 sm:flex-row sm:items-center ${justSaved ? 'ring-1 ring-green-500/40' : ''} `}
    >
      {/* Left: topic info */}
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
          {currentStatus && badge && (
            <span
              className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${badge.bg} `}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${badge.dot}`}
              />
              <span className={STATUS_STYLES[currentStatus]}>
                {TOPIC_STATUS_LABELS[currentStatus]}
              </span>
            </span>
          )}
        </div>
      </div>
      {/* Right: select + error */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="relative">
          <select
            value={currentStatus ?? ''}
            onChange={handleChange}
            disabled={isUpdating}
            className={`input appearance-none pr-8 text-sm font-semibold transition-all duration-200 ${isUpdating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${error ? 'animate-shake border-(--error) ring-1 ring-(--error)' : ''} ${justSaved ? 'border-green-500/50' : ''} min-w-40`}
          >
            {/* Null option — hidden once a real status is set */}
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
          </select>
          {/* Chevron / spinner overlay */}
          <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs opacity-50">
            {isUpdating ? <SpinnerIcon /> : <ChevronIcon />}
          </span>
        </div>
        {/* Inline error */}
        <div
          className={`overflow-hidden transition-all duration-300 ${error ? 'max-h-6 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <p className="text-[10px] font-medium text-(--error) italic">
            {error}
          </p>
        </div>
        {/* Success flash */}
        <div
          className={`overflow-hidden transition-all duration-300 ${justSaved ? 'max-h-6 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <p className="text-[10px] font-bold text-green-500">✓ Salvo</p>
        </div>
      </div>
    </div>
  );
}
