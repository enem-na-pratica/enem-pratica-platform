import type {
  AreaPerformanceDto,
  MockExamDto,
} from '@/src/core/application/common/dtos';
import type { Mapper } from '@/src/core/domain/contracts';
import {
  AreaPerformance,
  type KnowledgeArea,
  type KnowledgeAreaLabelKey,
} from '@/src/core/domain/entities';
import type { PrismaMockExamFull } from '@/src/core/infrastructure/databases/prisma/types';

const REVERSE_KNOWLEDGE_AREA_MAP: Record<KnowledgeArea, KnowledgeAreaLabelKey> =
  {
    LANGUAGES: 'languages',
    HUMANITIES: 'humanities',
    NATURAL_SCIENCES: 'naturalSciences',
    MATHEMATICS: 'mathematics',
  };

export class PrismaMockExamDtoMapper implements Mapper<
  PrismaMockExamFull,
  MockExamDto
> {
  map(input: PrismaMockExamFull): MockExamDto {
    const performances = input.performances.reduce(
      (acc, performance) => {
        const dtoKey = REVERSE_KNOWLEDGE_AREA_MAP[performance.area];
        if (dtoKey) {
          acc[dtoKey] = this.calculateStatistics(performance);
        }
        return acc;
      },
      {} as Record<KnowledgeAreaLabelKey, AreaPerformanceDto>,
    );

    return {
      id: input.id,
      authorId: input.authorId,
      title: input.title,
      createdAt: input.createdAt.toISOString(),
      performances,
    };
  }

  private calculateStatistics(
    performance: PrismaMockExamFull['performances'][number],
  ): AreaPerformanceDto {
    const areaPerformance = AreaPerformance.load({ ...performance });

    return {
      id: areaPerformance.id!,
      area: areaPerformance.area,
      statistics: {
        overallResult: { ...areaPerformance.overallResult },
        qualityAssessment: { ...areaPerformance.qualityAssessment },
        errorAnalysis: { ...areaPerformance.errorAnalysis },
      },
    };
  }
}
