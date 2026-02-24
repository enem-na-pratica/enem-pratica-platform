import { z } from 'zod';

import { usernameSchema } from './common';

const EXAM_CONFIG = {
  TITLE_MIN: 3,
  TITLE_MAX: 100,
  SCORE_MIN: 0,
  SCORE_MAX: 45,
};

const createCountSchema = (fieldName: string) =>
  z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? `${fieldName} is required`
          : `${fieldName} must be a number`,
    })
    .int({ error: `${fieldName} must be an integer` })
    .min(EXAM_CONFIG.SCORE_MIN, {
      error: `${fieldName} cannot be less than ${EXAM_CONFIG.SCORE_MIN}`,
    })
    .max(EXAM_CONFIG.SCORE_MAX, {
      error: `${fieldName} cannot exceed ${EXAM_CONFIG.SCORE_MAX}`,
    });

const performanceSchema = z.object({
  correctCount: createCountSchema('Correct count'),
  certaintyCount: createCountSchema('Certainty count'),
  doubtHits: createCountSchema('Doubt hits'),
  doubtErrors: createCountSchema('Doubt errors'),
  distractionErrors: createCountSchema('Distraction errors'),
  interpretationErrors: createCountSchema('Interpretation errors'),
});

export const createMockExamSchema = z.object({
  authorUsername: usernameSchema.optional(),

  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'The title is required'
          : 'Title must be a string',
    })
    .trim()
    .min(EXAM_CONFIG.TITLE_MIN, {
      error: `Title must be at least ${EXAM_CONFIG.TITLE_MIN} characters long`,
    })
    .max(
      EXAM_CONFIG.TITLE_MAX,
      `Title is too long (max ${EXAM_CONFIG.TITLE_MAX})`,
    ),

  performances: z.record(
    z.enum(['languages', 'humanities', 'naturalSciences', 'mathematics'], {
      error: 'Please select a valid subject category',
    }),
    performanceSchema,
  ),
});

export type CreateMockExamSchema = z.infer<typeof createMockExamSchema>;
