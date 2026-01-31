import { z } from "zod";

const PASSWORD_CONFIG = { MIN: 8, MAX: 20 };
const PASSWORD_REGEX = {
  LOWERCASE: /[a-z]/,
  UPPERCASE: /[A-Z]/,
  NUMBER: /[0-9]/,
  SYMBOL: /[^A-Za-z0-9]/,
};

export const passwordSchema = z.string()
  .min(
    PASSWORD_CONFIG.MIN,
    `Password must be at least ${PASSWORD_CONFIG.MIN} characters long`
  )
  .max(
    PASSWORD_CONFIG.MAX,
    `Password must be at most ${PASSWORD_CONFIG.MAX} characters long`
  )
  .regex(
    PASSWORD_REGEX.UPPERCASE,
    "Password must contain at least one uppercase letter"
  )
  .regex(
    PASSWORD_REGEX.LOWERCASE,
    "Password must contain at least one lowercase letter"
  )
  .regex(PASSWORD_REGEX.NUMBER, "Password must contain at least one number")
  .regex(PASSWORD_REGEX.SYMBOL, "Password must contain at least one symbol");

export type PasswordSchema = z.infer<typeof passwordSchema>;
