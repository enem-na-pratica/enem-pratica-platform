import { PrismaEssayStatsMapper } from '@/src/core/infrastructure/databases/prisma/mappers';

export function makePrismaEssayStatsDtoMapper() {
  return new PrismaEssayStatsMapper();
}
