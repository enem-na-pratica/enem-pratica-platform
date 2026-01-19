import { z } from "zod";

const THEME_CONFIG = {
  MIN: 20,
  MAX: 255,
};

const COMPETENCY_CONFIG = {
  MIN: 0,
  MAX: 200,
  STEP: 40,
};

const validCompetencyValues = Array.from(
  { length: (COMPETENCY_CONFIG.MAX - COMPETENCY_CONFIG.MIN) / COMPETENCY_CONFIG.STEP + 1 },
  (_, index) => COMPETENCY_CONFIG.MIN + index * COMPETENCY_CONFIG.STEP
);

const competencySchema = z
  .number()
  .min(
    COMPETENCY_CONFIG.MIN,
    `Score must be at least ${COMPETENCY_CONFIG.MIN}`
  )
  .max(
    COMPETENCY_CONFIG.MAX,
    `Score must be at most ${COMPETENCY_CONFIG.MAX}`
  )
  .refine(
    (value) => value % COMPETENCY_CONFIG.STEP === 0,
    {
      message: `Score must be a multiple of ${COMPETENCY_CONFIG.STEP} (e.g., ${validCompetencyValues.join(", ")})`,
    }
  );

export const newEssaySchema = z.object({
  theme: z
    .string()
    .trim()
    .min(
      THEME_CONFIG.MIN,
      `Theme must be at least ${THEME_CONFIG.MIN} characters long`
    )
    .max(
      THEME_CONFIG.MAX,
      `Theme must be at most ${THEME_CONFIG.MAX} characters long`
    ),

  competency1: competencySchema,

  competency2: competencySchema,

  competency3: competencySchema,

  competency4: competencySchema,

  competency5: competencySchema,
});

export type NewEssaySchema = z.infer<typeof newEssaySchema>;
