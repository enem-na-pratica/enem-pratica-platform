import { z } from "zod";

const USERNAME_CONFIG = { MIN: 3, MAX: 30 };
const USERNAME_REGEX = {
  ALLOWED: /^[a-z0-9._-]+$/,
  BOUNDARIES: /^[._-]|[._-]$/,
  SEQUENTIAL: /[._-]{2,}/,
};

export const usernameSchema = z.string()
  .trim()
  .toLowerCase()
  .min(
    USERNAME_CONFIG.MIN,
    `Username must be at least ${USERNAME_CONFIG.MIN} characters long`
  )
  .max(
    USERNAME_CONFIG.MAX,
    `Username must be at most ${USERNAME_CONFIG.MAX} characters long`
  )
  .regex(
    USERNAME_REGEX.ALLOWED,
    "Use only lowercase letters, numbers, periods, hyphens, or underscores"
  )
  .refine((val) => !USERNAME_REGEX.BOUNDARIES.test(val), {
    message: "Username cannot start or end with symbols",
  })
  .refine((val) => !USERNAME_REGEX.SEQUENTIAL.test(val), {
    message: "Username cannot contain sequential symbols (e.g., '..', '--')",
  });

export type UsernameSchema = z.infer<typeof usernameSchema>;
