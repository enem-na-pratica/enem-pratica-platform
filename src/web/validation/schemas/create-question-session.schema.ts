import { z } from 'zod';

import { usernameSchema } from './common';

const createCountSchema = (fieldName: string) =>
  z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? `${fieldName} é obrigatório`
          : `${fieldName} deve ser um número`,
    })
    .int({ error: `${fieldName} deve ser um número inteiro` })
    .min(0, {
      error: `${fieldName} deve ser no mínimo 0`,
    });

export const createQuestionSessionSchema = z
  .object({
    authorUsername: usernameSchema.optional(),

    topicId: z.uuid({
      error: (issue) =>
        issue.input === undefined
          ? 'O tópico é obrigatório'
          : 'O tópico deve ser um UUID válido',
    }),

    date: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(new Date(val).getTime()), {
        message: 'Data inválida',
      }),
    total: createCountSchema('Total'),
    correct: createCountSchema('Acertos'),
    isReviewed: z
      .boolean({
        error: 'O campo "revisado" deve ser booleano',
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.correct > data.total) {
      ctx.addIssue({
        code: 'custom',
        path: ['correct'],
        message: 'O número de acertos não pode ser maior que o total',
      });
    }
  });
