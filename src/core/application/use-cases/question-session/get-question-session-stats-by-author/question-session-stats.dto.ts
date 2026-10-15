export type QuestionSessionDailyAggregate = {
  date: string;
  sessions: number;
  totalQuestions: number;
  totalCorrect: number;
};

export type QuestionSessionStatsRaw = {
  dailyAggregates: QuestionSessionDailyAggregate[];
  unreviewedNextReviewDates: string[];
};

export type QuestionSessionStatsDto = {
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  overallAccuracy: number;
  weeklyProgress: {
    totalQuestions: number;
    accuracy: number;
  };
  studyStreak: number;
  pendingReviewsCount: number;
};
