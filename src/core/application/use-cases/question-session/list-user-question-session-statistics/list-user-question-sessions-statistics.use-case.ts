import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import type { ListQuestionSessionsByAuthorQuery } from './list-question-session-by-author.query';
import type {
  QuestionSessionStatisticsDto,
  QuestionSessionWithTopicAndSubjectDto,
  UserQuestionSessionsOverviewDto,
} from './user-question-session-overview.dto';

const DAY_MS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * DAY_MS;

type ListUserQuestionSessionsStatisticsUseCaseDeps = {
  userAccessService: UserAccessService;
  listQuestionSessionsByAuthorQuery: ListQuestionSessionsByAuthorQuery;
};

export type ListUserQuestionSessionsStatisticsInput = {
  authorUsername?: string;
  requester: Requester;
};

export class ListUserQuestionSessionsStatisticsUseCase implements UseCase<
  ListUserQuestionSessionsStatisticsInput,
  UserQuestionSessionsOverviewDto
> {
  private readonly userAccessService: UserAccessService;
  private readonly listQuestionSessionsByAuthorQuery: ListQuestionSessionsByAuthorQuery;

  constructor({
    userAccessService,
    listQuestionSessionsByAuthorQuery,
  }: ListUserQuestionSessionsStatisticsUseCaseDeps) {
    this.userAccessService = userAccessService;
    this.listQuestionSessionsByAuthorQuery = listQuestionSessionsByAuthorQuery;
  }

  async execute({
    requester,
    authorUsername,
  }: ListUserQuestionSessionsStatisticsInput): Promise<UserQuestionSessionsOverviewDto> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetUsername: authorUsername,
    });

    const sessions =
      await this.listQuestionSessionsByAuthorQuery.execute(authorId);

    const statistics = this.calculateStatistics(sessions);

    return { questionSessions: sessions, statistics };
  }

  private calculateStatistics(
    sessions: QuestionSessionWithTopicAndSubjectDto[],
  ): QuestionSessionStatisticsDto {
    if (sessions.length === 0) {
      return this.createEmptyStatistics();
    }

    const totals = this.calculateTotals(sessions);
    const weeklyData = this.calculateWeeklyProgress(sessions);

    return {
      totalSessions: sessions.length,
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

      studyStreak: this.calculateStreak(sessions),
      pendingReviewsCount: this.countPendingReviews(sessions),
    };
  }

  // --- Auxiliary Methods ---

  private calculateTotals(sessions: QuestionSessionWithTopicAndSubjectDto[]) {
    return sessions.reduce(
      (acc, s) => {
        acc.questions += s.total;
        acc.correct += s.correct;
        return acc;
      },
      { questions: 0, correct: 0 },
    );
  }

  private calculateWeeklyProgress(
    sessions: QuestionSessionWithTopicAndSubjectDto[],
  ) {
    const startOfToday = new Date().setHours(0, 0, 0, 0);

    const totals = { questions: 0, correct: 0 };

    for (const s of sessions) {
      const sessionTime = new Date(s.date).getTime();

      if (startOfToday - sessionTime >= SEVEN_DAYS_MS) {
        break;
      }

      totals.questions += s.total;
      totals.correct += s.correct;
    }

    return totals;
  }

  private calculateAccuracy(correct: number, total: number): number {
    return total > 0 ? correct / total : 0;
  }

  private countPendingReviews(
    sessions: QuestionSessionWithTopicAndSubjectDto[],
  ): number {
    const now = Date.now();
    return sessions.filter(
      (s) =>
        !s.isReviewed &&
        s.nextReviewDate &&
        new Date(s.nextReviewDate).getTime() < now,
    ).length;
  }

  private calculateStreak(
    sessions: QuestionSessionWithTopicAndSubjectDto[],
  ): number {
    const uniqueDays = Array.from(
      new Set(
        sessions.map((s) => {
          const d = new Date(s.date);
          return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        }),
      ),
    );

    const today = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
    ).getTime();
    const yesterday = today - DAY_MS;

    if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

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
