import { ValueObject } from "@/src/core/domain/shared";
import { capitalizePTBR } from "@/src/core/domain/shared/utils";

const NAME_CONFIG = { MIN: 20, MAX: 255 };

export class EssayTheme extends ValueObject<string> {
  private constructor(theme: string) {
    super(theme);
  }

  protected validate(theme: string): void {
    if (!theme && typeof theme !== "string") {
      throw new Error("The theme must be a string.");
    }

    if (theme.length < NAME_CONFIG.MIN || theme.length > NAME_CONFIG.MAX) {
      throw new Error(`The theme must be between ${NAME_CONFIG.MIN} and ${NAME_CONFIG.MAX} characters long.`);
    }
  }

  public static create(theme: string): EssayTheme {
    return new EssayTheme(capitalizePTBR(theme.trim()));
  }
}