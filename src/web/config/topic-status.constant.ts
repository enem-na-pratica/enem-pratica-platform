export const TOPIC_STATUS = {
  COMPREHENDED: 'COMPREHENDED',
  PRACTICE: 'PRACTICE',
  REVIEW: 'REVIEW',
} as const;

export type TopicStatus = (typeof TOPIC_STATUS)[keyof typeof TOPIC_STATUS];

export const TOPIC_STATUS_LABELS: Record<TopicStatus, string> = {
  [TOPIC_STATUS.COMPREHENDED]: 'Compreendido',
  [TOPIC_STATUS.PRACTICE]: 'Praticar',
  [TOPIC_STATUS.REVIEW]: 'Revisar',
};
