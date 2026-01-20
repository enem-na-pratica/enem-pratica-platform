import { ValueObject } from "@/src/core/domain/shared";

const USERNAME_CONFIG = { MIN: 3, MAX: 30 };

const USERNAME_REGEX = {
  ALLOWED: /^[a-z0-9._-]+$/,
  BOUNDARIES: /^[._-]|[._-]$/,
  SEQUENTIAL: /[._-]{2,}/,
};

export class Username extends ValueObject<string> {
  private constructor(username: string) {
    super(username);
  }

  protected validate(username: string): void {
    // TODO: Implement custom errors
    if (typeof username !== "string") {
      throw new Error("The username must be a string.");
    }

    if (username.length < USERNAME_CONFIG.MIN || username.length > USERNAME_CONFIG.MAX) {
      throw new Error(
        `The username must be between ${USERNAME_CONFIG.MIN} and ${USERNAME_CONFIG.MAX} characters long.`
      );
    }

    if (!USERNAME_REGEX.ALLOWED.test(username)) {
      throw new Error("Use only lowercase letters, numbers, dots, hyphens, or underscores.");
    }

    if (USERNAME_REGEX.BOUNDARIES.test(username)) {
      throw new Error("The username cannot start or end with symbols.");
    }

    if (USERNAME_REGEX.SEQUENTIAL.test(username)) {
      throw new Error("The username cannot contain sequential symbols (e.g., '..', '--').");
    }
  }

  public static create(username: string): Username {
    return new Username(username.trim().toLowerCase());
  }
}