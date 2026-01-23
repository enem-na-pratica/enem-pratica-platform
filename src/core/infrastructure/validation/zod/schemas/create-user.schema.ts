import { z } from "zod";
import { ROLES } from "@/src/core/domain/auth";
import { passwordSchema, usernameSchema } from './common';

const NAME_CONFIG = { MIN: 3, MAX: 50 };
const NAME_REGEX = /^[\p{L}\s]+$/u;

export const createUserSchema = z.object({
  name: z.string()
    .trim()
    .min(NAME_CONFIG.MIN, `Name must be at least ${NAME_CONFIG.MIN} characters long`)
    .max(NAME_CONFIG.MAX, `Name must be at most ${NAME_CONFIG.MAX} characters long`)
    .regex(NAME_REGEX, "Name must contain only letters and spaces"),

  username: usernameSchema,

  password: passwordSchema,

  role: z.enum(ROLES, {
    error: (issue) => `Invalid value "${issue.received}". Please select a valid permission level.`,
  }),

  teacherId: z
    .uuid("Teacher ID must be a valid UUID")
    .optional()
    .or(z.literal("")),
})
  .superRefine((data, ctx) => {
    if (
      data.role === ROLES.STUDENT &&
      (!data.teacherId || data.teacherId.trim() === "")
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Assigning a teacher is required for the Student role",
        path: ["teacherId"],
      });
    }
  });

export type CreateUserSchema = z.infer<typeof createUserSchema>;