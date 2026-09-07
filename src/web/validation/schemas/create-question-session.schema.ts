import { z } from 'zod';

const createCountSchema = ({
  fieldName,
  min = 0,
}: {
  fieldName: string;
  min?: number;
}) =>
  z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? `${fieldName} é obrigatório`
          : `${fieldName} deve ser um número`,
    })
    .int({ error: `${fieldName} deve ser um número inteiro` })
    .min(min, {
      error: `${fieldName} deve ser no mínimo ${min}`,
    });

const createDateSchema = z.string().superRefine((val, ctx) => {
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

export const createQuestionSessionSchema = z
  .object({
    topicId: z.uuid({
      error: (issue) =>
        issue.input === undefined
          ? 'O tópico é obrigatório'
          : 'O tópico deve ser um UUID válido',
    }),

    date: createDateSchema.optional(),
    total: createCountSchema({ fieldName: 'Total', min: 1 }),
    correct: createCountSchema({ fieldName: 'Acertos' }),
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
