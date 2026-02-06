import type { KnowledgeAreaLabelKey } from "@/src/core/domain/entities";
import type { AreaPerformanceDto } from "./area-performance.dto";

export type MockExamDto = {
  authorId: string;
  title: string;
  performances: Record<KnowledgeAreaLabelKey, AreaPerformanceDto>;
  createdAt: string;
}
