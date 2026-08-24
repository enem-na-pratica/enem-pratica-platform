import { z } from 'zod';

import { usernameSchema } from './common';

const getTodayInSaoPaulo = (): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
};

const createCountSchema = (fieldName: string, min: number = 0) =>
  z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? `${fieldName} is required`
          : `${fieldName} must be a number`,
    })
    .int({ error: `${fieldName} must be an integer` })
    .min(min, {
      error: `${fieldName} cannot be less than ${min}`,
    });

const createDateSchema = (optional = true) => {
  const schema = z
    .preprocess((val) => {
      if (val instanceof Date && !isNaN(val.getTime())) {
        return val.toISOString().split('T')[0];
      }

      if (typeof val === 'string') {
        const cleanVal = val.trim();

        if (/^\d{4}-\d{2}-\d{2}T/.test(cleanVal)) {
          return cleanVal.split('T')[0];
        }

        if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(cleanVal)) {
          return cleanVal.replace(/\//g, '-');
        }

        const dmyMatch = cleanVal.match(/^(\d{2})([-/])(\d{2})\2(\d{4})$/);
        if (dmyMatch) {
          const [, day, , month, year] = dmyMatch;
          return `${year}-${month}-${day}`;
        }
      }

      return val;
    }, z.string())
    .superRefine((val, ctx) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        ctx.addIssue({
          code: 'custom',
          message: `Invalid date format. Use YYYY-MM-DD, DD/MM/YYYY, etc.`,
        });
        return;
      }

      const inputDate = new Date(`${val}T00:00:00Z`);

      if (isNaN(inputDate.getTime())) {
        ctx.addIssue({
          code: 'custom',
          message: `Invalid date string: "${val}"`,
        });
        return;
      }

      if (val > getTodayInSaoPaulo()) {
        ctx.addIssue({
          code: 'custom',
          message: 'A date cannot be in the future',
        });
      }
    })
    .transform((val) => val);

  return optional ? schema.optional() : schema;
};

export const createQuestionSessionSchema = z
  .object({
    authorUsername: usernameSchema
      .or(z.uuid({ error: 'authorUsername must be a valid username or UUID' }))
      .optional(),

    topicId: z.uuid({
      error: (issue) =>
        issue.input === undefined
          ? 'This topicId is required'
          : 'topicId must be a valid UUID',
    }),

    date: createDateSchema(),
    total: createCountSchema('Total', 1),
    correct: createCountSchema('Correct'),
    isReviewed: z
      .boolean({
        error: 'isReviewed must be a boolean',
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.correct && data.total && data.correct > data.total) {
      ctx.addIssue({
        code: 'custom',
        path: ['correct'],
        message: 'Correct count cannot exceed total',
      });
    }
  });

export type CreateQuestionSessionSchema = z.output<
  typeof createQuestionSessionSchema
>;
