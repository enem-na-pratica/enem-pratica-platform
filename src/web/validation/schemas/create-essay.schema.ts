import { z } from 'zod';

import { usernameSchema } from './common';

const THEME_CONFIG = {
  MIN: 5,
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
        ? 'A nota é obrigatória'
        : 'A nota deve ser um número',
  })
  .min(COMPETENCY_CONFIG.MIN, {
    error: `A nota deve ser no mínimo ${COMPETENCY_CONFIG.MIN}`,
  })
  .max(COMPETENCY_CONFIG.MAX, {
    error: `A nota deve ser no máximo ${COMPETENCY_CONFIG.MAX}`,
  })
  .refine((value) => value % COMPETENCY_CONFIG.STEP === 0, {
    error: `A nota deve ser um múltiplo de ${COMPETENCY_CONFIG.STEP} (ex: ${validCompetencyValues.join(', ')})`,
  });

export const createEssaySchema = z.object({
  authorUsername: usernameSchema.optional(),

  theme: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'O tema é obrigatório'
          : 'O tema deve ser uma string',
    })
    .trim()
    .toLowerCase()
    .min(THEME_CONFIG.MIN, {
      error: `O tema deve ter pelo menos ${THEME_CONFIG.MIN} caracteres`,
    })
    .max(THEME_CONFIG.MAX, {
      error: `O tema deve ter no máximo ${THEME_CONFIG.MAX} caracteres`,
    }),

  grades: z.object({
    c1: competencySchema,
    c2: competencySchema,
    c3: competencySchema,
    c4: competencySchema,
    c5: competencySchema,
  }),
});
