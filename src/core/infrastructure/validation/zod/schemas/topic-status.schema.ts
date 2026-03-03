import { z } from 'zod';

import { TOPIC_STATUS } from '@/src/core/domain/entities';

export const topicStatusSchema = z.preprocess(
  (val) => {
    if (!Array.isArray(val)) return val;

    return [
      ...new Set(
        val.map((item) =>
          typeof item === 'string' ? item.toUpperCase() : item,
        ),
      ),
    ];
  },
  z
    .array(
      z.enum(TOPIC_STATUS, {
        error: (issue) => {
          if (issue.code === 'invalid_value') {
            return `The status "${issue.input}" is not valid. Choose from: ${Object.values(TOPIC_STATUS).join(', ')}`;
          }

          if (issue.code === 'invalid_type') {
            return 'Each status item must be a valid string.';
          }
        },
      }),
    )
    .optional(),
);

export type TopicStatusSchema = z.infer<typeof topicStatusSchema>;
