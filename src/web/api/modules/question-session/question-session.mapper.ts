import { QuestionSessionDto } from './question-session.dto';
import { QuestionSession } from './question-session.model';

export const QuestionSessionMapper = {
  toModel(dto: QuestionSessionDto): QuestionSession {
    return {
      ...dto,
      date: new Date(dto.date),
      nextReviewDate: dto.nextReviewDate ? new Date(dto.nextReviewDate) : null,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  },
};
