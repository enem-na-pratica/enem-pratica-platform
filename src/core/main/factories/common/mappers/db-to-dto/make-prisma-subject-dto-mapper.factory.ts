import { PrismaSubjectDtoMapper } from '@/src/core/infrastructure/databases/prisma/mappers/to-dto';

export function makePrismaSubjectDtoMapper() {
  return new PrismaSubjectDtoMapper();
}
