import { z } from "zod";
import { ROLES } from "@/src/core/domain/auth/roles";

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

export const createUserSchema = z.object({
  name: z.string()
    .trim()
    .min(NAME_CONFIG.MIN, `Name must be at least ${NAME_CONFIG.MIN} characters long`)
    .max(NAME_CONFIG.MAX, `Name must be at most ${NAME_CONFIG.MAX} characters long`)
    .regex(NAME_REGEX, "Name must contain only letters and spaces"),

  username: z.string()
    .trim()
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
      message: "Username cannot contain sequential symbols (e.g., '..')",
    }),

  password: z.string()
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
    .regex(PASSWORD_REGEX.SYMBOL, "Password must contain at least one symbol"),

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