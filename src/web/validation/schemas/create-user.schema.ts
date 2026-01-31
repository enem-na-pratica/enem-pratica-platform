import { z } from "zod";
import { ROLES } from "@/src/web/config";
import { usernameSchema, passwordSchema } from "./common";

const NAME_CONFIG = { MIN: 3, MAX: 50 };
const NAME_REGEX = /^[\p{L}\s]+$/u;

export const createUserSchema = z.object({
  name: z.string()
    .trim()
    .min(NAME_CONFIG.MIN, `O nome deve ter pelo menos ${NAME_CONFIG.MIN} caracteres`)
    .max(NAME_CONFIG.MAX, `O nome deve ter no máximo ${NAME_CONFIG.MAX} caracteres`)
    .regex(NAME_REGEX, "O nome deve conter apenas letras e espaços"),

  username: usernameSchema,

  password: passwordSchema,

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
