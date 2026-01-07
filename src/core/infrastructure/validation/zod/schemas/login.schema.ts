import { z } from 'zod';

const ALLOWED_CHARS_REGEX = /^[a-z0-9._-]+$/;
const STARTS_OR_ENDS_WITH_SYMBOL = /^[._-]|[._-]$/;
const SEQUENTIAL_SYMBOLS = /[._-]{2,}/;

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;

export const loginSchema = z.object({
  username: z.string()
    .trim()
    .min(USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters long`)
    .max(USERNAME_MAX_LENGTH, `Username must be at most ${USERNAME_MAX_LENGTH} characters long`)
    .regex(ALLOWED_CHARS_REGEX, {
      message: "Use only lowercase letters, numbers, dots, hyphens, or underscores",
    })
    .regex(STARTS_OR_ENDS_WITH_SYMBOL, {
      message: "Username cannot start or end with symbols",
    })
    .regex(SEQUENTIAL_SYMBOLS, {
      message: "Username cannot contain sequential symbols (e.g., '..', '--')",
    }),

  password: z.string().trim().min(8).max(30),
});
