import { TopicStatus } from '@/src/web/config';

export const STATUS_STYLES: Record<TopicStatus, string> = {
  COMPREHENDED: 'text-green-600 dark:text-green-400',
  PRACTICE: 'text-yellow-600 dark:text-yellow-400',
  REVIEW: 'text-red-500 dark:text-red-400',
};

export const STATUS_BADGE: Record<TopicStatus, { bg: string; dot: string }> = {
  COMPREHENDED: {
    bg: 'bg-green-500/10 border-green-500/20',
    dot: 'bg-green-500',
  },
  PRACTICE: {
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    dot: 'bg-yellow-500',
  },
  REVIEW: { bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-500' },
};
