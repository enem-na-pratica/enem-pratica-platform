import { Subject, Topic } from '@/src/web/api/modules/subject';

export type QuestionSession = {
  id: string;
  authorId: string;
  topicId: string;
  date: Date;
  total: number;
  correct: number;
  isReviewed: boolean;
  incorrect: number;
  performance: number;
  nextReviewDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type QuestionSessionWithTopicAndSubject = DeepPrettify<
  QuestionSession & {
    topic: Topic & {
      subject: Subject;
    };
  }
>;

export type QuestionSessionStatistics = {
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

export type UserQuestionSessionsOverview = {
  statistics: QuestionSessionStatistics;
  questionSessions: QuestionSessionWithTopicAndSubject[];
};
