import { PrismaEssayDtoMapper } from '@/src/core/infrastructure/databases/prisma/mappers/to-dto'

export function makePrismaEssayDtoMapper() {
  return new PrismaEssayDtoMapper();
}