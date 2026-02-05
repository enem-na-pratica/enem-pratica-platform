import { ValueObject } from "@/src/core/domain/shared";

export class TopicPosition extends ValueObject<number> {
  private constructor(position: number) {
    super(position);
  }

  protected validate(position: number): void {
    if (typeof position !== "number" || Number.isNaN(position)) {
      throw new Error("The topic position must be a valid number.");
    }

    if (!Number.isInteger(position)) {
      throw new Error("The topic position must be an integer.");
    }

    if (position <= 0) {
      throw new Error("The topic position must be a positive number greater than zero.");
    }
  }

  public static create(position: number): TopicPosition {
    return new TopicPosition(position);
  }
}