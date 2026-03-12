import type { Mapper } from '@/src/core/domain/contracts/mappers';
import { QuestionSession } from '@/src/core/domain/entities';
import type { QuestionSession as PrismaQuestionSession } from '@/src/generated/prisma/client';

export class QuestionSessionEntityMapper implements Mapper<
  PrismaQuestionSession,
  QuestionSession
> {
  map(input: PrismaQuestionSession): QuestionSession {
    return QuestionSession.load({
      id: input.id,
      authorId: input.authorId,
      topicId: input.topicId,
      date: input.date,
      total: input.total,
      correct: input.correct,
      isReviewed: input.isReviewed,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }
}
