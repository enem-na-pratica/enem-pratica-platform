import { z } from 'zod';

import { usernameSchema } from './common';

const EXAM_CONFIG = {
  TITLE_MIN: 3,
  TITLE_MAX: 100,
  SCORE_MIN: 0,
  SCORE_MAX: 45,
};

const QUESTIONS_PER_AREA = 45;

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

const validatePerformanceMetrics = (
  data: {
    correctCount: number;
    certaintyCount: number;
    doubtErrors: number;
    distractionErrors: number;
    interpretationErrors: number;
  },
  ctx: z.RefinementCtx,
) => {
  const totalErrors = QUESTIONS_PER_AREA - data.correctCount;

  if (data.certaintyCount > data.correctCount) {
    ctx.addIssue({
      code: 'custom',
      path: ['certaintyCount'],
      message: 'Certainty count cannot exceed the number of correct answers',
    });
  }

  if (data.doubtErrors > totalErrors) {
    ctx.addIssue({
      code: 'custom',
      path: ['doubtErrors'],
      message: 'Doubt-related errors cannot exceed the total number of errors',
    });
  }

  if (data.distractionErrors > totalErrors) {
    ctx.addIssue({
      code: 'custom',
      path: ['distractionErrors'],
      message: 'Distraction errors cannot exceed the total number of errors',
    });
  }

  if (data.interpretationErrors > totalErrors) {
    ctx.addIssue({
      code: 'custom',
      path: ['interpretationErrors'],
      message: 'Interpretation errors cannot exceed the total number of errors',
    });
  }

  if (data.interpretationErrors + data.distractionErrors > totalErrors) {
    ctx.addIssue({
      code: 'custom',
      path: ['interpretationErrors'],
      message:
        'The sum of interpretation and distraction errors cannot exceed the total number of errors',
    });
  }
};

const performanceSchema = z
  .object({
    correctCount: createCountSchema('Correct count'),
    certaintyCount: createCountSchema('Certainty count'),
    doubtErrors: createCountSchema('Doubt errors'),
    distractionErrors: createCountSchema('Distraction errors'),
    interpretationErrors: createCountSchema('Interpretation errors'),
  })
  .superRefine(validatePerformanceMetrics);

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

  performances: z.object({
    languages: performanceSchema,
    humanities: performanceSchema,
    naturalSciences: performanceSchema,
    mathematics: performanceSchema,
  }),
});

export type CreateMockExamSchema = z.infer<typeof createMockExamSchema>;
