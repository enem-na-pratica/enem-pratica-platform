import { PrismaEssayPaginatedSliceMapper } from '@/src/core/infrastructure/databases/prisma/mappers';

import { makePrismaEssayDtoMapper } from './make-prisma-essay-dto-mapper.factory';

export function makePrismaEssayPaginatedSliceMapper() {
  return new PrismaEssayPaginatedSliceMapper(makePrismaEssayDtoMapper());
}
