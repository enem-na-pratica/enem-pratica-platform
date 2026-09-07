import { useRef, useState } from 'react';

import type { TopicStatus } from '@/src/web/config';

const SUCCESS_MESSAGE_DURATION_MS = 1500;
const ERROR_MESSAGE_DURATION_MS = 3000;

type UseTopicStatusOptions = {
  initialStatus: TopicStatus | null;
  topicId: string;
  onStatusChange: (topicId: string, newStatus: TopicStatus) => Promise<void>;
};

export function useTopicStatus({
  initialStatus,
  topicId,
  onStatusChange,
}: UseTopicStatusOptions) {
  const [currentStatus, setCurrentStatus] = useState<TopicStatus | null>(
    initialStatus,
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
      await onStatusChange(topicId, newStatus);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), SUCCESS_MESSAGE_DURATION_MS);
    } catch {
      setCurrentStatus(prevStatusRef.current);
      setError('Erro ao salvar. Tente novamente.');
      setTimeout(() => setError(null), ERROR_MESSAGE_DURATION_MS);
    } finally {
      setIsUpdating(false);
    }
  };

  return { currentStatus, isUpdating, error, justSaved, handleChange };
}
