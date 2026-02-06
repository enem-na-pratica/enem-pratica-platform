import { KnowledgeAreaLabelKey } from "@/src/core/domain/entities";

export type CreateMockExamDto = {
  authorId: string;
  title: string;
  performances: Record<
    KnowledgeAreaLabelKey,
    {
      correctCount: number;
      certaintyCount: number;
      doubtHits: number;
      doubtErrors: number;
      distractionErrors: number;
      interpretationErrors: number;
    }
  >;
}