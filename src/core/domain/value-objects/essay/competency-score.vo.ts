import { ValueObject } from "@/src/core/domain/shared";

const COMPETENCY_CONFIG = { MIN: 0, MAX: 200, STEP: 20 };

export class CompetencyScore extends ValueObject<number> {
  private constructor(score: number) {
    super(score);
  }

  protected validate(score: number): void {
    if (typeof score !== "number" || Number.isNaN(score)) {
      throw new Error("The score must be a valid number.");
    }

    if (score < COMPETENCY_CONFIG.MIN || score > COMPETENCY_CONFIG.MAX) {
      throw new Error(`The score must be between ${COMPETENCY_CONFIG.MIN} and ${COMPETENCY_CONFIG.MAX}.`);
    }

    if (score % COMPETENCY_CONFIG.STEP !== 0) {
      throw new Error(`The score must be a multiple of ${COMPETENCY_CONFIG.STEP}.`);
    }
  }

  public static create(score: number): CompetencyScore {
    return new CompetencyScore(score);
  }
}