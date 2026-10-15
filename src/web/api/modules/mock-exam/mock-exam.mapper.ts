import type { KnowledgeArea } from '@/src/web/config';

import type {
  AreaPerformanceDto,
  MockExamDto,
  MockExamStatsDto,
} from './mock-exam.dto';
import type {
  AreaPerformance,
  KnowledgeAreaLabelKey,
  MockExam,
  MockExamStats,
} from './mock-exam.model';

export const MockExamMapper = {
  toModel(dto: MockExamDto): MockExam {
    const mappedPerformances = Object.fromEntries(
      Object.entries(dto.performances).map(([key, value]) => [
        key,
        this.mapArea(value),
      ]),
    ) as Record<KnowledgeAreaLabelKey, AreaPerformance>;

    return {
      ...dto,
      createdAt: new Date(dto.createdAt),
      performances: mappedPerformances,
    };
  },

  mapArea(areaDto: AreaPerformanceDto): AreaPerformance {
    return {
      ...areaDto,
      area: areaDto.area.toUpperCase() as KnowledgeArea,
    };
  },

  toStats(dto: MockExamStatsDto): MockExamStats {
    return {
      ...dto,
      performancePerArea: { ...dto.performancePerArea },
      errorPrevalence: { ...dto.errorPrevalence },
    };
  },
};
