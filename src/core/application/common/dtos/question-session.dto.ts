export type QuestionSessionDto = {
  id: string;
  authorId: string;
  topicId: string;
  date: string;
  total: number;
  correct: number;
  isReviewing: boolean;
  createdAt: string;
  updatedAt: string;
};
