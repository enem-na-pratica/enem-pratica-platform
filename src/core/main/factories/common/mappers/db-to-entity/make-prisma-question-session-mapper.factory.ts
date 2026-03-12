import { QuestionSessionEntityMapper } from '@/src/core/infrastructure/databases/prisma/mappers';

export function makeQuestionSessionEntityMapper() {
  return new QuestionSessionEntityMapper();
}
