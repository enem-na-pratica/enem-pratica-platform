import { z } from 'zod';

import { ROLES } from '@/src/core/domain/auth';

import { passwordSchema, usernameSchema } from './common';

const NAME_CONFIG = { MIN: 3, MAX: 50 };
const NAME_REGEX = /^[\p{L}\s]+$/u;

export const createUserSchema = z
  .object({
    name: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? 'Name is required'
            : 'Name must be a string',
      })
      .trim()
      .min(NAME_CONFIG.MIN, {
        error: `Name must be at least ${NAME_CONFIG.MIN} characters long`,
      })
      .max(NAME_CONFIG.MAX, {
        error: `Name must be at most ${NAME_CONFIG.MAX} characters long`,
      })
      .regex(NAME_REGEX, {
        error: 'Name must contain only letters and spaces',
      }),

    username: usernameSchema,

    password: passwordSchema,

    role: z.enum(ROLES, {
      error: (issue) =>
        `Invalid value "${issue.received}". Please select a valid permission level.`,
    }),

    teacherId: z
      .uuid({ error: 'Teacher ID must be a valid UUID' })
      .trim()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.role === ROLES.STUDENT &&
      (!data.teacherId || data.teacherId.trim() === '')
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Assigning a teacher is required for the Student role',
        path: ['teacherId'],
      });
    }
  });

export type CreateUserSchema = z.infer<typeof createUserSchema>;
