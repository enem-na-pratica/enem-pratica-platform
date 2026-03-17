import { PrismaQuestionSessionWithTopicAndSubjectDtoMapper } from '@/src/core/infrastructure/databases/prisma/mappers';

export function makePrismaQuestionSessionWithTopicAndSubjectDtoMapper() {
  return new PrismaQuestionSessionWithTopicAndSubjectDtoMapper();
}
