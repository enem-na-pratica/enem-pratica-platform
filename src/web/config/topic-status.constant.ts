export const TOPIC_STATUS = {
  COMPREHENDED: 'COMPREHENDED',
  PRACTICE: 'PRACTICE',
  REVIEW: 'REVIEW',
} as const;

export type TopicStatus = (typeof TOPIC_STATUS)[keyof typeof TOPIC_STATUS];
