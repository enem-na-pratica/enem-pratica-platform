import { PrismaQuestionSessionStatsRawMapper } from '@/src/core/infrastructure/databases/prisma/mappers';

export function makePrismaQuestionSessionStatsRawMapper() {
  return new PrismaQuestionSessionStatsRawMapper();
}
