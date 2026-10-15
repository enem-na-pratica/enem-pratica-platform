import type { QuestionSessionStatsRaw } from '@/src/core/application/use-cases/question-session';
import type { Mapper } from '@/src/core/domain/contracts';
import { QuestionSession } from '@/src/core/domain/entities';
import type { QuestionSessionStatsRawPrisma } from '@/src/core/infrastructure/databases/prisma/contracts';

const toDateString = (date: Date): string => date.toISOString().split('T')[0];

export class PrismaQuestionSessionStatsRawMapper implements Mapper<
  QuestionSessionStatsRawPrisma,
  QuestionSessionStatsRaw
> {
  map({
    dailyGroups,
    unreviewedSessions,
  }: QuestionSessionStatsRawPrisma): QuestionSessionStatsRaw {
    const dailyAggregates = dailyGroups.map((group) => ({
      date: toDateString(group.date),
      sessions: group._count._all,
      totalQuestions: group._sum.total ?? 0,
      totalCorrect: group._sum.correct ?? 0,
    }));

    const unreviewedNextReviewDates = unreviewedSessions
      .map(
        (session) =>
          QuestionSession.load({
            id: session.id,
            authorId: session.authorId,
            topicId: session.topicId,
            date: toDateString(session.date),
            total: session.total,
            correct: session.correct,
            isReviewed: session.isReviewed,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
          }).nextReviewDate,
      )
      .filter((date): date is string => date !== null);

    return { dailyAggregates, unreviewedNextReviewDates };
  }
}
