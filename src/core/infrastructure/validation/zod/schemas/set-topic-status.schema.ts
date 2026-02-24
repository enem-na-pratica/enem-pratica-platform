import { z } from 'zod';

import { TOPIC_STATUS, type TopicStatus } from '@/src/core/domain/entities';

import { usernameSchema } from './common';

const TOPIC_STATUS_VALUES = Object.values(TOPIC_STATUS) as TopicStatus[];

const topicStatusSchema = z.enum(TOPIC_STATUS_VALUES, {
  error: `Invalid topic status. Expected one of: ${TOPIC_STATUS_VALUES.join(', ')}`,
});

export const setTopicStatusSchema = z.object({
  authorUsername: usernameSchema.optional(),

  topicId: z.uuid({
    error: (issue) =>
      issue.input === undefined
        ? 'This topicId is required'
        : 'topicId must be a valid UUID',
  }),

  status: topicStatusSchema,
});

export type SetTopicStatusSchema = z.infer<typeof setTopicStatusSchema>;
