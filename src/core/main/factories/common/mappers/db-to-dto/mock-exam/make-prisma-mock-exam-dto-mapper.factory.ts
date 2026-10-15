import { PrismaMockExamDtoMapper } from '@/src/core/infrastructure/databases/prisma/mappers';

export function makePrismaMockExamDtoMapper() {
  return new PrismaMockExamDtoMapper();
}
