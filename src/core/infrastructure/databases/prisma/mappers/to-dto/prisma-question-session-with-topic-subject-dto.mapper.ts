import type { QuestionSessionWithTopicAndSubjectDto } from '@/src/core/application/use-cases/question-session/list-user-question-session-statistics';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import { REVIEW_DAYS, REVIEW_THRESHOLDS } from '@/src/core/domain/entities';
import type { PrismaQuestionSessionWithTopicAndSubject } from '@/src/core/infrastructure/databases/prisma/types';

export class PrismaQuestionSessionWithTopicAndSubjectDtoMapper implements Mapper<
  PrismaQuestionSessionWithTopicAndSubject,
  QuestionSessionWithTopicAndSubjectDto
> {
  public map(
    prismaQuestionSession: PrismaQuestionSessionWithTopicAndSubject,
  ): QuestionSessionWithTopicAndSubjectDto {
    return {
      id: prismaQuestionSession.id,
      authorId: prismaQuestionSession.authorId,
      topicId: prismaQuestionSession.topicId,
      date: prismaQuestionSession.date.toISOString(),
      total: prismaQuestionSession.total,
      correct: prismaQuestionSession.correct,
      isReviewed: prismaQuestionSession.isReviewed,
      incorrect: this.incorrectCount({
        correct: prismaQuestionSession.correct,
        total: prismaQuestionSession.correct,
      }),
      performance: this.accuracy({
        correct: prismaQuestionSession.correct,
        total: prismaQuestionSession.total,
      }),
      nextReviewDate: this.nextReviewDate({
        correct: prismaQuestionSession.correct,
        total: prismaQuestionSession.correct,
        date: prismaQuestionSession.date,
        isReviewed: prismaQuestionSession.isReviewed,
      }),
      createdAt: prismaQuestionSession.createdAt.toISOString(),
      updatedAt: prismaQuestionSession.updatedAt.toISOString(),
      topic: this.mapTopic(prismaQuestionSession.topic),
    };
  }

  private mapTopic(topic: PrismaQuestionSessionWithTopicAndSubject['topic']) {
    return {
      id: topic.id,
      title: topic.title,
      position: topic.position,
      subjectId: topic.subjectId,
      createdAt: topic.createdAt,
      subject: this.mapSubject(topic.subject),
    };
  }

  private mapSubject(
    subject: PrismaQuestionSessionWithTopicAndSubject['topic']['subject'],
  ) {
    return {
      id: subject.id,
      name: subject.name,
      slug: subject.slug,
      category: subject.category,
      createdAt: subject.createdAt.toISOString(),
    };
  }

  private incorrectCount({
    correct,
    total,
  }: {
    total: number;
    correct: number;
  }): number {
    return total - correct;
  }

  private accuracy({
    correct,
    total,
  }: {
    total: number;
    correct: number;
  }): number {
    if (total === 0) return 0;
    return correct / total;
  }

  private nextReviewDate({
    correct,
    total,
    isReviewed,
    date,
  }: {
    total: number;
    correct: number;
    isReviewed: boolean;
    date: Date;
  }): string | null {
    if (total === 0 || isReviewed) {
      return null;
    }

    const daysToAdd = this.calculateDaysToAdd(
      this.accuracy({ correct, total }),
    );

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + daysToAdd);

    return nextDate.toISOString();
  }

  private calculateDaysToAdd(performance: number): number {
    if (performance >= REVIEW_THRESHOLDS.EXCELLENT) {
      return REVIEW_DAYS.EXCELLENT;
    }

    if (performance >= REVIEW_THRESHOLDS.GOOD) {
      return REVIEW_DAYS.GOOD;
    }

    return REVIEW_DAYS.DEFAULT;
  }
}
