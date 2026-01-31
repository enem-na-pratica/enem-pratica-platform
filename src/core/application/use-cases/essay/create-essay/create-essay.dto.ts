import type { Grades } from '@/src/core/domain/value-objects';

export type CreateEssayDto = {
  authorUsername?: string;
  theme: string;
  grades: Grades;
}