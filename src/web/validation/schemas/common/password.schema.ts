import { z } from "zod";

const PASSWORD_CONFIG = { MIN: 8, MAX: 20 };
const PASSWORD_REGEX = {
  LOWERCASE: /[a-z]/,
  UPPERCASE: /[A-Z]/,
  NUMBER: /[0-9]/,
  SYMBOL: /[^A-Za-z0-9]/,
};

export const passwordSchema = z.string()
  .trim()
  .min(
    PASSWORD_CONFIG.MIN,
    `A senha deve ter no mínimo ${PASSWORD_CONFIG.MIN} caracteres`
  )
  .max(
    PASSWORD_CONFIG.MAX,
    `A senha deve ter no máximo ${PASSWORD_CONFIG.MAX} caracteres`
  )
  .regex(
    PASSWORD_REGEX.UPPERCASE,
    "A senha deve conter pelo menos uma letra maiúscula"
  )
  .regex(
    PASSWORD_REGEX.LOWERCASE,
    "A senha deve conter pelo menos uma letra minúscula"
  )
  .regex(PASSWORD_REGEX.NUMBER, "A senha deve conter pelo menos um número")
  .regex(PASSWORD_REGEX.SYMBOL, "A senha deve conter pelo menos um símbolo");

export type PasswordSchema = z.infer<typeof passwordSchema>;
