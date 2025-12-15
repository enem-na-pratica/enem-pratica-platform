export function notInTheFuture(date: Date): void {
  // TODO: Implementar erros personalizados
  if (isNaN(date.getTime())) {
    throw new Error("Data inválida.");
  }

  if (date.getTime() > Date.now()) {
    throw new Error("A data não pode estar no futuro.");
  }
}
