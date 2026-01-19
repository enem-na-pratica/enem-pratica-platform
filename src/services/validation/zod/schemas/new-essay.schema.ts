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
    `A nota deve ser no mínimo ${COMPETENCY_CONFIG.MIN}`
  )
  .max(
    COMPETENCY_CONFIG.MAX,
    `A nota deve ser no máximo ${COMPETENCY_CONFIG.MAX}`
  )
  .refine(
    (value) => value % COMPETENCY_CONFIG.STEP === 0,
    {
      message:
        `A nota deve ser um múltiplo de ${COMPETENCY_CONFIG.STEP} (ex: ${validCompetencyValues.join(", ")})`,
    }
  )

export const newEssaySchema = z.object({
  theme: z
    .string()
    .trim()
    .min(
      THEME_CONFIG.MIN,
      `O tema deve ter pelo menos ${THEME_CONFIG.MIN} caracteres`
    )
    .max(
      THEME_CONFIG.MAX,
      `O tema deve ter no máximo ${THEME_CONFIG.MAX} caracteres`
    ),

  competency1: competencySchema,

  competency2: competencySchema,

  competency3: competencySchema,

  competency4: competencySchema,

  competency5: competencySchema,
});

export type NewEssaySchema = z.infer<typeof newEssaySchema>;
