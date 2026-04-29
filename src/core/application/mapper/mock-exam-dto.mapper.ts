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
    const result = {} as Record<KnowledgeAreaLabelKey, AreaPerformanceDto>;

    (Object.keys(KNOWLEDGE_AREA_MAP) as KnowledgeAreaLabelKey[]).forEach(
      (labelKey) => {
        const areaEnum = KNOWLEDGE_AREA_MAP[labelKey];
        const performance = exam.getPerformanceByArea(areaEnum);

        result[labelKey] = this.mapAreaPerformance(performance);
      },
    );

    return result;
  }

  private mapAreaPerformance(performance: AreaPerformance): AreaPerformanceDto {
    return {
      id: performance.id!,
      area: performance.area,
      statistics: {
        overallResult: {
          totalQuestions: performance.overallResult.totalQuestions,
          correctAnswers: performance.overallResult.correctAnswers,
          wrongAnswers: performance.overallResult.wrongAnswers,
          performanceRate: performance.overallResult.performanceRate,
        },
        qualityAssessment: {
          certaintyHits: performance.qualityAssessment.certaintyHits,
          confidenceRate: performance.qualityAssessment.confidenceRate,
          doubtHits: performance.qualityAssessment.doubtHits,
          doubtErrors: performance.qualityAssessment.doubtErrors,
          criticalErrors: performance.qualityAssessment.criticalErrors,
        },
        errorAnalysis: {
          distractionErrors: performance.errorAnalysis.distractionErrors,
          interpretationErrors: performance.errorAnalysis.interpretationErrors,
          knowledgeGapsErrors: performance.errorAnalysis.knowledgeGapsErrors,
        },
      },
    };
  }
}
