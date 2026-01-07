export function validUsername(username: string): void {
  // TODO: Implement custom errors
  if (typeof username !== "string") {
    throw new Error("The username must be a string.");
  }

  if (username.length < 3 || username.length > 30) {
    throw new Error("The username must be between 3 and 30 characters long.");
  }

  const allowedCharsRegex = /^[a-z0-9._-]+$/;
  if (!allowedCharsRegex.test(username)) {
    throw new Error("Use only lowercase letters, numbers, dots, hyphens, or underscores.");
  }

  const startsOrEndsWithSymbol = /^[._-]|[._-]$/;
  if (startsOrEndsWithSymbol.test(username)) {
    throw new Error("The username cannot start or end with symbols.");
  }

  const sequentialSymbols = /[._-]{2,}/;
  if (sequentialSymbols.test(username)) {
    throw new Error("The username cannot contain sequential symbols (e.g., '..', '--').");
  }
}
