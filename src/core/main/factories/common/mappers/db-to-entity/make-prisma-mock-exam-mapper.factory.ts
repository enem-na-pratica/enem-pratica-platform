import { MockExamEntityMapper } from '@/src/core/infrastructure/databases/prisma/mappers'

export function makeMockExamEntityMapper() {
  return new MockExamEntityMapper();
}