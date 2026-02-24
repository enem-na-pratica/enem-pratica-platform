import { z } from 'zod';

import { usernameSchema } from './common';

const THEME_CONFIG = {
  MIN: 20,
  MAX: 255,
};

const COMPETENCY_CONFIG = {
  MIN: 0,
  MAX: 200,
  STEP: 20,
};

const validCompetencyValues = Array.from(
  {
    length:
      (COMPETENCY_CONFIG.MAX - COMPETENCY_CONFIG.MIN) / COMPETENCY_CONFIG.STEP +
      1,
  },
  (_, index) => COMPETENCY_CONFIG.MIN + index * COMPETENCY_CONFIG.STEP,
);

const competencySchema = z
  .number({
    error: (issue) =>
      issue.input === undefined
        ? 'This competency is required'
        : 'Score must be a number',
  })
  .min(COMPETENCY_CONFIG.MIN, {
    error: `Score must be at least ${COMPETENCY_CONFIG.MIN}`,
  })
  .max(COMPETENCY_CONFIG.MAX, {
    error: `Score must be at most ${COMPETENCY_CONFIG.MAX}`,
  })
  .refine((value) => value % COMPETENCY_CONFIG.STEP === 0, {
    error: `Score must be a multiple of ${COMPETENCY_CONFIG.STEP} (e.g., ${validCompetencyValues.join(', ')})`,
  });

export const createEssaySchema = z.object({
  authorUsername: usernameSchema.optional(),

  theme: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'The theme is required'
          : 'Theme must be a string',
    })
    .trim()
    .min(THEME_CONFIG.MIN, {
      error: `Theme must be at least ${THEME_CONFIG.MIN} characters long`,
    })
    .max(THEME_CONFIG.MAX, {
      error: `Theme must be at most ${THEME_CONFIG.MAX} characters long`,
    }),

  grades: z.object({
    c1: competencySchema,
    c2: competencySchema,
    c3: competencySchema,
    c4: competencySchema,
    c5: competencySchema,
  }),
});

export type CreateEssaySchema = z.infer<typeof createEssaySchema>;
