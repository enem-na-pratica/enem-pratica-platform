import { z } from 'zod';

const positiveIntFromString = (defaultValue: number, max?: number) => {
  let schema = z
    .number({ error: 'Expected a numeric value' })
    .int({ error: 'Must be an integer' })
    .positive({ error: 'Must be a positive integer greater than zero' });

  if (max !== undefined) {
    schema = schema.max(max, { error: `Must be less than or equal to ${max}` });
  }

  return z
    .string()
    .regex(/^\d+$/, { error: 'Must contain only numeric digits' })
    .optional()
    .default(String(defaultValue))
    .transform((value) => Number(value))
    .pipe(schema);
};

const dateFromString = z
  .string()
  .optional()
  .refine(
    (value) => value === undefined || !Number.isNaN(new Date(value).getTime()),
    { error: 'Invalid date format. Expected a valid date string' },
  )
  .refine(
    (value) => value === undefined || new Date(value).getTime() <= Date.now(),
    { error: 'Date cannot be in the future' },
  )
  .transform((value) => (value === undefined ? undefined : new Date(value)));

export const listEssaysQuerySchema = z
  .object({
    page: positiveIntFromString(1),
    limit: positiveIntFromString(10, 100),
    sortBy: z.enum(['createdAt', 'theme']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    theme: z
      .string()
      .trim()
      .min(3, { error: 'Theme must be at least 3 characters long' })
      .optional(),
    startDate: dateFromString,
    endDate: dateFromString,
  })
  .refine(
    (data) =>
      data.startDate === undefined ||
      data.endDate === undefined ||
      data.startDate <= data.endDate,
    {
      error: 'startDate cannot be later than endDate',
      path: ['startDate'],
    },
  );

export type ListEssaysQuery = z.infer<typeof listEssaysQuerySchema>;

export type ListEssaysQueryInput = z.input<typeof listEssaysQuerySchema>;
