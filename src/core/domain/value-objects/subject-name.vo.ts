import { ValueObject } from "@/src/core/domain/shared";
import { capitalizePTBR } from "@/src/core/domain/shared/utils";

const NAME_CONFIG = { MIN: 3, MAX: 50 };

export class SubjectName extends ValueObject<string> {
  private constructor(theme: string) {
    super(theme);
  }

  protected validate(name: string): void {
    if (!name && typeof name !== "string") {
      throw new Error("The subject name must be a string.");
    }

    if (name.length < NAME_CONFIG.MIN || name.length > NAME_CONFIG.MAX) {
      throw new Error(`The subject name must be between ${NAME_CONFIG.MIN} and ${NAME_CONFIG.MAX} characters long.`);
    }
  }

  public static create(name: string): SubjectName {
    return new SubjectName(capitalizePTBR(name.trim()));
  }
}