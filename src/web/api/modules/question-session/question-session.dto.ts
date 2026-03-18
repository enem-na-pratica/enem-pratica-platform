type TopicDto = {
  id: string;
  title: string;
  position: number;
  subjectId: string;
  createdAt: Date;
};

type SubjectDto = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  createdAt: string;
};

export type QuestionSessionDto = {
  id: string;
  authorId: string;
  topicId: string;
  date: string;
  total: number;
  correct: number;
  isReviewed: boolean;
  incorrect: number;
  performance: number;
  nextReviewDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type QuestionSessionWithTopicAndSubjectDto = DeepPrettify<
  QuestionSessionDto & {
    topic: TopicDto & {
      subject: SubjectDto;
    };
  }
>;

export type QuestionSessionStatisticsDto = {
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

export type UserQuestionSessionsOverviewDto = {
  statistics: QuestionSessionStatisticsDto;
  questionSessions: QuestionSessionWithTopicAndSubjectDto[];
};
