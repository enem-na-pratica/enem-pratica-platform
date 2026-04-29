import { KnowledgeAreaLabelKey } from '@/src/core/domain/entities';

export type CreateMockExamDto = {
  authorUsername?: string;
  title: string;
  performances: Record<
    KnowledgeAreaLabelKey,
    {
      correctCount: number;
      certaintyCount: number;
      doubtErrors: number;
      distractionErrors: number;
      interpretationErrors: number;
    }
  >;
};
