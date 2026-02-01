import { ValueObject } from "@/src/core/domain/shared";

const NAME_CONFIG = { MIN: 3, MAX: 50 };

export class SubjectName extends ValueObject<string> {
  private constructor(theme: string) {
    super(theme);
  }

  protected validate(name: string): void {
    if (!name && typeof name !== "string") {
      throw new Error("The theme must be a string.");
    }

    if (name.length < NAME_CONFIG.MIN || name.length > NAME_CONFIG.MAX) {
      throw new Error(`The subject name must be between ${NAME_CONFIG.MIN} and ${NAME_CONFIG.MAX} characters long.`);
    }
  }

  public static create(name: string): SubjectName {
    return new SubjectName(SubjectName.capitalize(name.trim()));
  }

  private static capitalize(text: string) {
    return text
      .split(" ")
      .map(word => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
}