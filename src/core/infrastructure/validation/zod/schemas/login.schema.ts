import { z } from 'zod';

const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;

export const loginSchema = z.object({
  username: z.string().trim().regex(USERNAME_REGEX).min(3).max(50),
  password: z.string().trim().min(8).max(100),
});
