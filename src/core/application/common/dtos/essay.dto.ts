import type { Grades } from '@/src/core/domain/value-objects';

export type EssayDto = {
  id: string;
  authorId: string;
  theme: string;
  grade: Grades & { total: number };
  createdAt: string;
};
