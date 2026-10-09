import type { UseCase } from '@/src/core/application/common/interfaces';
import type { QuestionSessionStatisticsDto } from '@/src/core/application/use-cases/question-session/list-user-question-session-statistics';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import type { GetQuestionSessionRawAggregateQuery } from './get-question-session-raw-aggregate.query';
import { QuestionSessionDailyAggregate } from './question-session-stats.dto';

const DAY_MS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * DAY_MS;

type GetQuestionSessionStatsByAuthorUseCaseDeps = {
  userAccessService: UserAccessService;
  getQuestionSessionRawAggregateQuery: GetQuestionSessionRawAggregateQuery;
};

export type GetQuestionSessionStatsByAuthorInput = {
  authorUsername?: string;
  requester: Requester;
};

export class GetQuestionSessionStatsByAuthorUseCase implements UseCase<
  GetQuestionSessionStatsByAuthorInput,
  QuestionSessionStatisticsDto
> {
  private readonly userAccessService: UserAccessService;
  private readonly getQuestionSessionRawAggregateQuery: GetQuestionSessionRawAggregateQuery;

  constructor({
    userAccessService,
    getQuestionSessionRawAggregateQuery,
  }: GetQuestionSessionStatsByAuthorUseCaseDeps) {
    this.userAccessService = userAccessService;
    this.getQuestionSessionRawAggregateQuery =
      getQuestionSessionRawAggregateQuery;
  }

  async execute({
    requester,
    authorUsername,
  }: GetQuestionSessionStatsByAuthorInput): Promise<QuestionSessionStatisticsDto> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetIdentifier: authorUsername,
    });

    const { dailyAggregates, unreviewedNextReviewDates } =
      await this.getQuestionSessionRawAggregateQuery.execute(authorId);

    return this.calculateStatistics(dailyAggregates, unreviewedNextReviewDates);
  }

  private calculateStatistics(
    days: QuestionSessionDailyAggregate[],
    unreviewedNextReviewDates: string[],
  ): QuestionSessionStatisticsDto {
    if (days.length === 0) {
      return this.createEmptyStatistics();
    }

    const totals = this.calculateTotals(days);
    const weeklyData = this.calculateWeeklyProgress(days);

    return {
      totalSessions: totals.sessions,
      totalQuestions: totals.questions,
      totalCorrect: totals.correct,
      overallAccuracy: this.calculateAccuracy(totals.correct, totals.questions),

      weeklyProgress: {
        totalQuestions: weeklyData.questions,
        accuracy: this.calculateAccuracy(
          weeklyData.correct,
          weeklyData.questions,
        ),
      },

      studyStreak: this.calculateStreak(days),
      pendingReviewsCount: this.countPendingReviews(unreviewedNextReviewDates),
    };
  }

  private calculateTotals(days: QuestionSessionDailyAggregate[]) {
    return days.reduce(
      (acc, d) => {
        acc.sessions += d.sessions;
        acc.questions += d.totalQuestions;
        acc.correct += d.totalCorrect;
        return acc;
      },
      { sessions: 0, questions: 0, correct: 0 },
    );
  }

  // Depends on `days` being ordered by date DESC.
  private calculateWeeklyProgress(days: QuestionSessionDailyAggregate[]) {
    const startOfToday = new Date().setHours(0, 0, 0, 0);

    const totals = { questions: 0, correct: 0 };

    for (const d of days) {
      const dayTime = new Date(d.date).getTime();

      if (startOfToday - dayTime >= SEVEN_DAYS_MS) {
        break;
      }

      totals.questions += d.totalQuestions;
      totals.correct += d.totalCorrect;
    }

    return totals;
  }

  private calculateAccuracy(correct: number, total: number): number {
    return total > 0 ? correct / total : 0;
  }

  private countPendingReviews(nextReviewDates: string[]): number {
    const now = Date.now();

    return nextReviewDates.filter((date) => new Date(date).getTime() < now)
      .length;
  }

  // Depends on `days` being ordered by date DESC.
  private calculateStreak(days: QuestionSessionDailyAggregate[]): number {
    const uniqueDays = Array.from(
      new Set(
        days.map((s) => {
          const d = new Date(s.date);
          return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        }),
      ),
    );

    if (!uniqueDays.length) return 0;

    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();

    const yesterday = today - DAY_MS;
    const dayBeforeYesterday = yesterday - DAY_MS;

    if (
      uniqueDays[0] !== today &&
      uniqueDays[0] !== yesterday &&
      uniqueDays[0] !== dayBeforeYesterday
    ) {
      return 0;
    }

    let streak = 0;
    let expected = uniqueDays[0];

    for (const day of uniqueDays) {
      if (day === expected) {
        streak++;
        expected -= DAY_MS;
      } else {
        break;
      }
    }

    return streak;
  }

  private createEmptyStatistics(): QuestionSessionStatisticsDto {
    return {
      totalSessions: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      overallAccuracy: 0,
      weeklyProgress: {
        totalQuestions: 0,
        accuracy: 0,
      },
      studyStreak: 0,
      pendingReviewsCount: 0,
    };
  }
}
