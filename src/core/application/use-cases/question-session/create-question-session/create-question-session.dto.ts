export type CreateQuestionSessionDto = {
  authorUsername?: string;
  topicId: string;
  date?: Date;
  total: number;
  correct: number;
  isReviewed?: boolean;
};
