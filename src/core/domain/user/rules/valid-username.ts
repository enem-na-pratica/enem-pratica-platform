const ALLOWED_CHARS_REGEX = /^[a-z0-9._-]+$/;
const STARTS_OR_ENDS_WITH_SYMBOL = /^[._-]|[._-]$/;
const SEQUENTIAL_SYMBOLS = /[._-]{2,}/;

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;

export function validUsername(username: string): void {
  // TODO: Implement custom errors
  if (typeof username !== "string") {
    throw new Error("The username must be a string.");
  }

  if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
    throw new Error(
      `The username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters long.`
    );
  }

  if (!ALLOWED_CHARS_REGEX.test(username)) {
    throw new Error("Use only lowercase letters, numbers, dots, hyphens, or underscores.");
  }

  if (STARTS_OR_ENDS_WITH_SYMBOL.test(username)) {
    throw new Error("The username cannot start or end with symbols.");
  }

  if (SEQUENTIAL_SYMBOLS.test(username)) {
    throw new Error("The username cannot contain sequential symbols (e.g., '..', '--').");
  }
}
