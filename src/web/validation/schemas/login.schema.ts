import { z } from 'zod';

import { passwordSchema, usernameSchema } from './common';

export const loginSchema = z.object({
  username: usernameSchema,

  // TODO: replace with passwordSchema.
  // Using a simplified password validation for mocked credentials during development.
  password: z.string().trim().min(8).max(30),
});
