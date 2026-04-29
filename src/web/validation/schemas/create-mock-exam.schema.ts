import { z } from 'zod';

import { usernameSchema } from './common';

const MOCK_EXAM_CONFIG = {
  TITLE_MIN: 3,
  TITLE_MAX: 100,
  SCORE_MIN: 0,
  SCORE_MAX: 45,
};

const QUESTIONS_PER_AREA = 45;

const performanceMetricSchema = z
  .number({
    error: (issue) =>
      issue.input === undefined
        ? 'O valor é obrigatório'
        : 'O valor deve ser um número',
  })
  .int({ error: 'O valor deve ser um número inteiro' })
  .min(MOCK_EXAM_CONFIG.SCORE_MIN, {
    error: `O valor deve ser no mínimo ${MOCK_EXAM_CONFIG.SCORE_MIN}`,
  })
  .max(MOCK_EXAM_CONFIG.SCORE_MAX, {
    error: `O valor deve ser no máximo ${MOCK_EXAM_CONFIG.SCORE_MAX}`,
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
      message:
        'O número de respostas com certeza não pode exceder o número de acertos',
    });
  }

  if (data.doubtErrors > totalErrors) {
    ctx.addIssue({
      code: 'custom',
      path: ['doubtErrors'],
      message: 'Erros por dúvida não podem exceder o total de erros',
    });
  }

  if (data.distractionErrors > totalErrors) {
    ctx.addIssue({
      code: 'custom',
      path: ['distractionErrors'],
      message: 'Erros por distração não podem exceder o total de erros',
    });
  }

  if (data.interpretationErrors > totalErrors) {
    ctx.addIssue({
      code: 'custom',
      path: ['interpretationErrors'],
      message: 'Erros de interpretação não podem exceder o total de erros',
    });
  }

  if (data.interpretationErrors + data.distractionErrors > totalErrors) {
    ctx.addIssue({
      code: 'custom',
      path: ['interpretationErrors'],
      message:
        'A soma dos erros de interpretação e distração não pode exceder o total de erros',
    });
  }
};

const performanceSchema = z
  .object({
    correctCount: performanceMetricSchema,
    certaintyCount: performanceMetricSchema,
    doubtErrors: performanceMetricSchema,
    distractionErrors: performanceMetricSchema,
    interpretationErrors: performanceMetricSchema,
  })
  .superRefine(validatePerformanceMetrics);

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
