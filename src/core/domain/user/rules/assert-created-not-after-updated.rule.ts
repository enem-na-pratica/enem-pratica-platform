export function assertCreatedNotAfterUpdated(createdAt: Date, updatedAt: Date): void {
  // TODO: Implementar erros personalizados
  if (isNaN(createdAt.getTime()) || isNaN(updatedAt.getTime())) {
    throw new Error("Datas inválidas.");
  }

  if (createdAt.getTime() > updatedAt.getTime()) {
    throw new Error("A data de criação não pode ser maior que a data de atualização.");
  }
}
