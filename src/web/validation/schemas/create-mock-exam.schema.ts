import { z } from 'zod';

import { usernameSchema } from './common';

const MOCK_EXAM_CONFIG = {
  TITLE_MIN: 3,
  TITLE_MAX: 100,
  SCORE_MIN: 0,
  SCORE_MAX: 45,
};

const performanceMetricSchema = z
  .number({
    error: (issue) =>
      issue.input === undefined
        ? 'A valor é obrigatória'
        : 'A valor deve ser um número',
  })
  .int({ error: 'O valor deve ser um número inteiro' })
  .min(MOCK_EXAM_CONFIG.SCORE_MIN, {
    error: `O valor deve ser no mínimo ${MOCK_EXAM_CONFIG.SCORE_MIN}`,
  })
  .max(MOCK_EXAM_CONFIG.SCORE_MAX, {
    error: `O valor deve ser no máximo ${MOCK_EXAM_CONFIG.SCORE_MAX}`,
  });

const performanceSchema = z.object({
  correctCount: performanceMetricSchema,
  certaintyCount: performanceMetricSchema,
  doubtHits: performanceMetricSchema,
  doubtErrors: performanceMetricSchema,
  distractionErrors: performanceMetricSchema,
  interpretationErrors: performanceMetricSchema,
});

export const createMockExamSchema = z.object({
  authorUsername: usernameSchema.optional(),

  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'O título é obrigatório'
          : 'O título deve ser uma string',
    })
    .trim()
    .min(MOCK_EXAM_CONFIG.TITLE_MIN, {
      error: `O título deve ter pelo menos ${MOCK_EXAM_CONFIG.TITLE_MIN} caracteres`,
    })
    .max(MOCK_EXAM_CONFIG.TITLE_MAX, {
      error: `O título deve ter no máximo ${MOCK_EXAM_CONFIG.TITLE_MAX} caracteres`,
    }),

  performances: z.object({
    languages: performanceSchema,
    humanities: performanceSchema,
    naturalSciences: performanceSchema,
    mathematics: performanceSchema,
  }),
});
