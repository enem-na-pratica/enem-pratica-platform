const NAME_CONFIG = {
  MIN: 20,
  MAX: 255,
}

export function validTheme(theme: string): void {
  if (!theme && typeof theme !== "string") {
    throw new Error("The theme must be a string.");
  }

  const cleanedTheme = theme.trim();
  if (cleanedTheme.length < NAME_CONFIG.MIN || cleanedTheme.length > NAME_CONFIG.MAX) {
    throw new Error(`The theme must be between ${NAME_CONFIG.MIN} and ${NAME_CONFIG.MAX} characters long.`);
  }
}