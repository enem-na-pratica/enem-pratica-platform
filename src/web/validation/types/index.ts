import { z } from 'zod';

import {
  createEssaySchema,
  createMockExamSchema,
  createUserSchema,
  createQuestionSessionSchema,
  loginSchema,
  setIsReviewedSchema,
} from '@/src/web/validation/schemas';

export type CreateEssayFormValues = z.infer<typeof createEssaySchema>;
export type CreateMockExamFormValues = z.infer<typeof createMockExamSchema>;
export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type CreateQuestionSessionFormValues = z.infer<
  typeof createQuestionSessionSchema
>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SetIsReviewedFormValues = z.infer<typeof setIsReviewedSchema>;
