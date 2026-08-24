export type CreateQuestionSessionDto = {
  authorUsername?: string;
  topicId: string;
  date?: string;
  total: number;
  correct: number;
  isReviewed?: boolean;
};
