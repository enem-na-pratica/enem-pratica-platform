import { z } from 'zod';
import { usernameSchema, passwordSchema } from './common';

export const loginSchema = z.object({
  username: usernameSchema,

  password: z.string().trim().min(8).max(30),
});

