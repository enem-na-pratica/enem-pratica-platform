const NAME_CONFIG = {
  MIN: 3,
  MAX: 50,
};

const NAME_REGEX = /^[\p{L}\s]+$/u;

export function validName(name: string): void {
  if (typeof name !== "string") {
    throw new Error("The name must be a string.");
  }

  const cleanedName = name.trim();

  if (cleanedName.length < NAME_CONFIG.MIN || cleanedName.length > NAME_CONFIG.MAX) {
    throw new Error(`The name must be between ${NAME_CONFIG.MIN} and ${NAME_CONFIG.MAX} characters long.`);
  }

  if (!NAME_REGEX.test(cleanedName)) {
    throw new Error("The name should only contain letters and spaces.");
  }
}