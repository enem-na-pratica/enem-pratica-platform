import { PrismaUserDtoMapper } from '@/src/core/infrastructure/databases/prisma/mappers';

export function makePrismaUserDtoMapper() {
  return new PrismaUserDtoMapper();
}