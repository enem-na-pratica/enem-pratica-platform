import { PrismaTopicProgressDtoMapper } from '@/src/core/infrastructure/databases/prisma/mappers/to-dto';

export function makePrismaTopicProgressDtoMapper() {
  return new PrismaTopicProgressDtoMapper();
}
