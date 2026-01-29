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
    `O username deve ter no mínimo ${USERNAME_CONFIG.MIN} caracteres`
  )
  .max(
    USERNAME_CONFIG.MAX,
    `O username deve ter no máximo ${USERNAME_CONFIG.MAX} caracteres`
  )
  .regex(
    USERNAME_REGEX.ALLOWED,
    "Use apenas letras minúsculas, números, pontos, hífens ou underlines"
  )
  .refine((val) => !USERNAME_REGEX.BOUNDARIES.test(val), {
    message: "O username não pode começar ou terminar com símbolos",
  })
  .refine((val) => !USERNAME_REGEX.SEQUENTIAL.test(val), {
    message: "O username não pode conter símbolos sequenciais (ex: '..', '--')",
  });

export type UsernameSchema = z.infer<typeof usernameSchema>;
