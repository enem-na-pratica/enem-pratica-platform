import { EssayEntityMapper } from '@/src/core/infrastructure/databases/prisma/mappers'

export function makeEssayEntityMapper() {
  return new EssayEntityMapper();
}