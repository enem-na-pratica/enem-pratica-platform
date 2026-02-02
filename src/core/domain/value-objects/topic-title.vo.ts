import { ValueObject } from "@/src/core/domain/shared";

const TITLE_CONFIG = { MIN: 3, MAX: 100 };

export class TopicTitle extends ValueObject<string> {
  private constructor(title: string) {
    super(title);
  }

  protected validate(title: string): void {
    if (!title && typeof title !== "string") {
      throw new Error("The topic title must be a string.");
    }

    if (title.length < TITLE_CONFIG.MIN || title.length > TITLE_CONFIG.MAX) {
      throw new Error(`The topic title must be between ${TITLE_CONFIG.MIN} and ${TITLE_CONFIG.MAX} characters long.`);
    }
  }

  public static create(title: string): TopicTitle {
    return new TopicTitle(title.trim());
  }

  // private static capitalize(text: string) {
  //   return text
  //     .split(" ")
  //     .map(word => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
  //     .join(" ");
  // }
}