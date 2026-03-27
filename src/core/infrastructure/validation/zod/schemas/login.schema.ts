import { z } from 'zod';

import { passwordSchema, usernameSchema } from './common';

const activePasswordSchema =
  process.env.NODE_ENV === 'production'
    ? passwordSchema
    : z.string().trim().min(8).max(30);

export const loginSchema = z.object({
  username: usernameSchema,
  password: activePasswordSchema,
});
