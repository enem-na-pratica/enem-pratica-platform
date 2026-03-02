import { z } from 'zod';

import { Slug } from '@/src/core/domain/value-objects';

const SLUG_CONFIG = { MIN: 3, MAX: 50 };

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugSchema = z.preprocess(
  (value) => {
    return typeof value === 'string' ? Slug.slugify(value) : value;
  },
  z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Slug is required'
          : 'Slug must be a string',
    })
    .min(SLUG_CONFIG.MIN, {
      error: `Slug must be at least ${SLUG_CONFIG.MIN} characters long`,
    })
    .max(SLUG_CONFIG.MAX, {
      error: `Slug must be at most ${SLUG_CONFIG.MAX} characters long`,
    })
    .regex(slugRegex, {
      error:
        'Invalid slug: use only lowercase letters, numbers, and hyphens (no double hyphens or hyphens at the ends).',
    }),
);

export type SlugSchema = z.infer<typeof slugSchema>;
