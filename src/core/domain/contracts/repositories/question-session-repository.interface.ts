import type { QuestionSession } from '@/src/core/domain/entities';

export interface QuestionSessionRepository {
  create(questionSession: QuestionSession): Promise<QuestionSession>;
}
