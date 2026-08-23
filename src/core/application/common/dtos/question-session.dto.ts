export type QuestionSessionDto = {
  id: string;
  authorId: string;
  topicId: string;
  date: string; // YYYY-MM-DD format
  total: number;
  correct: number;
  isReviewed: boolean;
  incorrect: number;
  performance: number;
  nextReviewDate: string | null; // YYYY-MM-DD format
  createdAt: string;
  updatedAt: string;
};
