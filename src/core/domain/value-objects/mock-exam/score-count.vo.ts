import { ValueObject } from "@/src/core/domain/shared";

const COMPETENCY_CONFIG = { MIN: 0, MAX: 45 };

export class ScoreCount extends ValueObject<number> {
  constructor(score: number) {
    super(score);
  }

  protected validate(score: number): void {
    if (typeof score !== "number" || Number.isNaN(score)) {
      throw new Error("The score must be a valid number.");
    }

    if (!Number.isInteger(score)) {
      throw new Error("The store must be an integer.");
    }

    if (score < COMPETENCY_CONFIG.MIN || score > COMPETENCY_CONFIG.MAX) {
      throw new Error(`The score must be between ${COMPETENCY_CONFIG.MIN} and ${COMPETENCY_CONFIG.MAX}.`);
    }
  }

  public static create(value: number): ScoreCount {
    return new ScoreCount(value);
  }

  public valueOf(): number {
    return this._value;
  }
}