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

const createDateSchema = (optional = true) => {
  const schema = z.string().superRefine((val, ctx) => {
    if (isNaN(new Date(val).getTime())) {
      ctx.addIssue({
        code: 'custom',
        message: `Invalid date string: "${val}"`,
      });
      return;
    }

    const inputDate = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate > today) {
      ctx.addIssue({
        code: 'custom',
        message: 'A given cannot be in the future',
      });
    }
  });

  return optional ? schema.optional() : schema;
};

export const createQuestionSessionSchema = z
  .object({
    authorUsername: usernameSchema.optional(),

    topicId: z.uuid({
      error: (issue) =>
        issue.input === undefined
          ? 'This topicId is required'
          : 'topicId must be a valid UUID',
    }),

    date: createDateSchema(),
    total: createCountSchema('Total'),
    correct: createCountSchema('Correct'),
    isReviewed: z
      .boolean({
        error: 'isReviewed must be a boolean',
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
