import { z } from 'zod';

export const setIsReviewedSchema = z.object({
  questionSessionId: z.uuid({
    error: (issue) =>
      issue.input === undefined
        ? 'questionSessionId is required'
        : 'questionSessionId must be a UUID',
  }),

  isReviewed: z.boolean({
    error: (issue) =>
      issue.input === undefined
        ? 'isReviewed is required'
        : 'isReviewed must be a boolean',
  }),
});

export type setIsReviewedSchema = z.infer<typeof setIsReviewedSchema>;
