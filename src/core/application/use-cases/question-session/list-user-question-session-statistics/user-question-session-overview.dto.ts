import type {
  QuestionSessionDto,
  SubjectDto,
  TopicDto,
} from '@/src/core/application/common/dtos';

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
