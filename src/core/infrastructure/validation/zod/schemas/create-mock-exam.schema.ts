import { z } from "zod";
import { usernameSchema } from './common';

const EXAM_CONFIG = {
  TITLE_MIN: 1,
  TITLE_MAX: 100,
  SCORE_MIN: 0,
  SCORE_MAX: 45,
};

const createCountSchema = (fieldName: string) =>
  z.number({ message: `${fieldName} must be a number` })
    .int(`${fieldName} must be an integer`)
    .min(EXAM_CONFIG.SCORE_MIN, `${fieldName} cannot be negative`)
    .max(EXAM_CONFIG.SCORE_MAX, `${fieldName} cannot exceed ${EXAM_CONFIG.SCORE_MAX}`);

const performanceSchema = z.object({
  correctCount: createCountSchema("Correct count"),
  certaintyCount: createCountSchema("Certainty count"),
  doubtHits: createCountSchema("Doubt hits"),
  doubtErrors: createCountSchema("Doubt errors"),
  distractionErrors: createCountSchema("Distraction errors"),
  interpretationErrors: createCountSchema("Interpretation errors"),
});

export const createMockExamSchema = z.object({
  authorUsername: usernameSchema.optional(),

  title: z
    .string()
    .trim()
    .min(EXAM_CONFIG.TITLE_MIN, "Title is required")
    .max(EXAM_CONFIG.TITLE_MAX, `Title is too long (max ${EXAM_CONFIG.TITLE_MAX})`),

  performances: z.record(
    z.enum(["languages", "humanities", "naturalSciences", "mathematics"], {
      message: "Please select a valid subject category",
    }),
    performanceSchema
  ),
});

export type CreateMockExamSchema = z.infer<typeof createMockExamSchema>;