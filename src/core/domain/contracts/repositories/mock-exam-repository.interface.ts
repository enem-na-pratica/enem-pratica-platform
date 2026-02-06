import type { MockExam } from "@/src/core/domain/entities";

export interface MockExamRepository {
  create(mockExam: MockExam): Promise<MockExam>;
}