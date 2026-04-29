import type {
  AreaPerformanceDto,
  MockExamDto,
} from '@/src/core/application/common/dtos';
import type { Mapper } from '@/src/core/domain/contracts/mappers/mapper.interface';
import {
  type AreaPerformance,
  KNOWLEDGE_AREA_MAP,
  type KnowledgeAreaLabelKey,
  type MockExam,
} from '@/src/core/domain/entities';

export class MockExamDtoMapper implements Mapper<MockExam, MockExamDto> {
  map(input: MockExam): MockExamDto {
    return {
      id: input.id!,
      authorId: input.authorId,
      title: input.title,
      createdAt: input.createdAt.toISOString(),
      performances: this.mapPerformances(input),
    };
  }

  private mapPerformances(
    exam: MockExam,
  ): Record<KnowledgeAreaLabelKey, AreaPerformanceDto> {
    return (Object.keys(KNOWLEDGE_AREA_MAP) as KnowledgeAreaLabelKey[]).reduce(
      (acc, labelKey) => {
        const areaEnum = KNOWLEDGE_AREA_MAP[labelKey];
        acc[labelKey] = this.mapAreaPerformance(
          exam.getPerformanceByArea(areaEnum),
        );
        return acc;
      },
      {} as Record<KnowledgeAreaLabelKey, AreaPerformanceDto>,
    );
  }

  private mapAreaPerformance(performance: AreaPerformance): AreaPerformanceDto {
    return {
      id: performance.id!,
      area: performance.area,
      statistics: {
        overallResult: { ...performance.overallResult },
        qualityAssessment: { ...performance.qualityAssessment },
        errorAnalysis: { ...performance.errorAnalysis },
      },
    };
  }
}
