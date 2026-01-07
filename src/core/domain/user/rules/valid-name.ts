export function validName(name: string): void {
  // TODO: Implement custom errors
  if (typeof name !== "string") {
    throw new Error("The name must be a string.");
  }

  if (name.length < 3 || name.length > 30) {
    throw new Error("The name must be between 3 and 30 characters long.");
  }
}
