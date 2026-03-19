import { z } from 'zod';

export const setIsReviewedSchema = z.object({
  isReviewed: z.boolean({
    error: (issue) =>
      issue.input === undefined
        ? 'O campo "revisado" é obrigatório'
        : 'O campo "revisado" deve ser booleano',
  }),
});
