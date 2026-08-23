import type { QuestionSessionWithTopicAndSubjectDto } from '@/src/core/application/use-cases/question-session/list-user-question-session-statistics';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import { QuestionSession } from '@/src/core/domain/entities';
import type { PrismaQuestionSessionWithTopicAndSubject } from '@/src/core/infrastructure/databases/prisma/types';

export class PrismaQuestionSessionWithTopicAndSubjectDtoMapper implements Mapper<
  PrismaQuestionSessionWithTopicAndSubject,
  QuestionSessionWithTopicAndSubjectDto
> {
  public map(
    prismaQuestionSession: PrismaQuestionSessionWithTopicAndSubject,
  ): QuestionSessionWithTopicAndSubjectDto {
    const questionSession = QuestionSession.load({
      id: prismaQuestionSession.id,
      authorId: prismaQuestionSession.authorId,
      topicId: prismaQuestionSession.topicId,
      date: prismaQuestionSession.date.toISOString().split('T')[0],
      total: prismaQuestionSession.total,
      correct: prismaQuestionSession.correct,
      isReviewed: prismaQuestionSession.isReviewed,
      createdAt: prismaQuestionSession.createdAt,
      updatedAt: prismaQuestionSession.updatedAt,
    });

    return {
      id: questionSession.id!,
      authorId: questionSession.authorId,
      topicId: questionSession.topicId,
      date: questionSession.date,
      total: questionSession.total,
      correct: questionSession.correct,
      isReviewed: questionSession.isReviewed,

      incorrect: questionSession.incorrect,
      performance: questionSession.performance,
      nextReviewDate: questionSession.nextReviewDate,

      createdAt: questionSession.createdAt.toISOString(),
      updatedAt: questionSession.updatedAt.toISOString(),
      topic: this.mapTopic(prismaQuestionSession.topic),
    };
  }

  private mapTopic(topic: PrismaQuestionSessionWithTopicAndSubject['topic']) {
    return {
      id: topic.id,
      title: topic.title,
      position: topic.position,
      subjectId: topic.subjectId,
      createdAt: topic.createdAt.toISOString(),
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
}
