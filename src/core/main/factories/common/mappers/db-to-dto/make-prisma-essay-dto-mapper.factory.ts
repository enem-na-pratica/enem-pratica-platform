import { PrismaEssayDtoMapper } from '@/src/core/infrastructure/databases/prisma/mappers';

export function makePrismaEssayDtoMapper() {
  return new PrismaEssayDtoMapper();
}