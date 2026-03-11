import { z } from 'zod';

import { usernameSchema } from './common';

const createCountSchema = (fieldName: string) =>
  z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? `${fieldName} is required`
          : `${fieldName} must be a number`,
    })
    .int({ error: `${fieldName} must be an integer` })
    .min(0, {
      error: `${fieldName} cannot be less than 0`,
    });

const dateFromString = z.string().transform((val, ctx) => {
  const parsed = new Date(val);

  if (isNaN(parsed.getTime())) {
    ctx.addIssue({
      code: 'custom',
      message: `Invalid date string: "${val}"`,
    });
    return z.NEVER;
  }

  return parsed;
});

export const createQuestionSessionSchema = z
  .object({
    authorUsername: usernameSchema.optional(),

    topicId: z.uuid({
      error: (issue) =>
        issue.input === undefined
          ? 'This topicId is required'
          : 'topicId must be a valid UUID',
    }),

    date: dateFromString.optional(),
    total: createCountSchema('Total'),
    correct: createCountSchema('Correct'),
    isReviewing: z
      .boolean({
        error: 'isReviewing must be a boolean',
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.correct > data.total) {
      ctx.addIssue({
        code: 'custom',
        path: ['correct'],
        message: 'Correct count cannot exceed total',
      });
    }
  });

export type CreateQuestionSessionSchema = z.infer<
  typeof createQuestionSessionSchema
>;
