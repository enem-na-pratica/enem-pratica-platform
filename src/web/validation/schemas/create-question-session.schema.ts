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

const createDateSchema = (optional = true) => {
  const schema = z.string().superRefine((val, ctx) => {
    if (isNaN(new Date(val).getTime())) {
      ctx.addIssue({
        code: 'custom',
        message: 'Data inválida',
      });
      return;
    }

    const inputDate = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate > today) {
      ctx.addIssue({
        code: 'custom',
        message: 'A data não pode ser no futuro',
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
          ? 'O tópico é obrigatório'
          : 'O tópico deve ser um UUID válido',
    }),

    date: createDateSchema(),
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
