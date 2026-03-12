export type QuestionSessionDto = {
  id: string;
  authorId: string;
  topicId: string;
  date: string;
  total: number;
  correct: number;
  isReviewing: boolean;
  incorrect: number;
  performance: number;
  nextReviewDate: string | null;
  createdAt: string;
  updatedAt: string;
};
