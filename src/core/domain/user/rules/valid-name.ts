export function validName(name: string): void {
  // TODO: Implementar erros personalizados
  if (typeof name !== "string") {
    throw new Error("O valor deve ser uma string.");
  }
  if (name.trim().length < 3) {
    throw new Error("O nome deve ter pelo menos 3 caracteres.");
  }
}
