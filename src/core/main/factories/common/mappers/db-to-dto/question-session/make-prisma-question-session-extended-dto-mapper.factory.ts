import { PrismaQuestionSessionExtendedDtoMapper } from '@/src/core/infrastructure/databases/prisma/mappers/to-dto/prisma-question-session-extended-dto.mapper';

export function makePrismaQuestionSessionExtendedDtoMapper() {
  return new PrismaQuestionSessionExtendedDtoMapper();
}
