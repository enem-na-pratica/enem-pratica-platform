import type { QuestionSessionDto } from '@/src/core/application/common/dtos';
import type { Mapper } from '@/src/core/domain/contracts/mappers/mapper.interface';
import type { QuestionSession } from '@/src/core/domain/entities';

export class QuestionSessionDtoMapper implements Mapper<
  QuestionSession,
  QuestionSessionDto
> {
  public map(questionSession: QuestionSession): QuestionSessionDto {
    return {
      id: questionSession.id!,
      authorId: questionSession.authorId,
      topicId: questionSession.topicId,
      date: questionSession.date.toISOString(),
      total: questionSession.total,
      correct: questionSession.correct,
      isReviewed: questionSession.isReviewed,
      incorrect: questionSession.incorrect,
      performance: questionSession.performance,
      nextReviewDate: questionSession.nextReviewDate?.toISOString() ?? null,
      createdAt: questionSession.createdAt.toISOString(),
      updatedAt: questionSession.updatedAt.toISOString(),
    };
  }
}
