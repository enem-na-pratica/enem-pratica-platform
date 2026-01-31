import { z } from 'zod';
import {
  createEssaySchema,
  createUserSchema,
  loginSchema
} from '@/src/web/validation/schemas';

export type CreateEssayFormValues = z.infer<typeof createEssaySchema>;
export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;