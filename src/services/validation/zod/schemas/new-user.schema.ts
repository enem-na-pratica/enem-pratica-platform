import { z } from "zod";
import { ROLES } from "@/src/ui/constants";

const NAME_CONFIG = { MIN: 3, MAX: 50 };
const NAME_REGEX = /^[\p{L}\s]+$/u;

const USERNAME_CONFIG = { MIN: 3, MAX: 30 };
const USERNAME_REGEX = {
  ALLOWED: /^[a-z0-9._-]+$/,
  BOUNDARIES: /^[._-]|[._-]$/,
  SEQUENTIAL: /[._-]{2,}/,
};

const PASSWORD_CONFIG = { MIN: 8, MAX: 20 };
const PASSWORD_REGEX = {
  LOWERCASE: /[a-z]/,
  UPPERCASE: /[A-Z]/,
  NUMBER: /[0-9]/,
  SYMBOL: /[^A-Za-z0-9]/,
};

export const newUserSchema = z.object({
  name: z.string()
    .trim()
    .min(NAME_CONFIG.MIN, `O nome deve ter pelo menos ${NAME_CONFIG.MIN} caracteres`)
    .max(NAME_CONFIG.MAX, `O nome deve ter no máximo ${NAME_CONFIG.MAX} caracteres`)
    .regex(NAME_REGEX, "O nome deve conter apenas letras e espaços"),

  username: z.string()
    .trim()
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
      message: "O username não pode conter símbolos sequenciais (ex: '..')",
    }),

  password: z.string()
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
    .regex(PASSWORD_REGEX.SYMBOL, "A senha deve conter pelo menos um símbolo"),

  role: z.enum(ROLES, {
    error: (issue) => `Valor inválido "${issue.received}". Selecione um nível de permissão válido.`,
  }),

  teacherId: z
    .uuid("O ID do professor deve ser um UUID válido")
    .optional()
    .or(z.literal("")),
})
  .superRefine((data, ctx) => {
    if (
      data.role === ROLES.STUDENT
      && (!data.teacherId || data.teacherId.trim() === "")
    ) {
      ctx.addIssue({
        code: "custom",
        message: "É obrigatório vincular um professor para o nível Estudante",
        path: ["teacherId"],
      });
    }
  });

export type NewUserSchema = z.infer<typeof newUserSchema>;