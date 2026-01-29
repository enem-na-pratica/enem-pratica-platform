import { z } from 'zod';
import {
  createEssaySchema,
  createUserSchema,
  loginSchema
} from '@/src/web/validation/schemas';

export type CreateEssaySchema = z.infer<typeof createEssaySchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;