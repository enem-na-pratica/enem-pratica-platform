import type {
  AreaPerformanceDto,
  MockExamDto,
} from '@/src/core/application/common/dtos';
import type { Mapper } from '@/src/core/domain/contracts';
import type {
  KnowledgeArea,
  KnowledgeAreaLabelKey,
} from '@/src/core/domain/entities';
import type { PrismaMockExamFull } from '@/src/core/infrastructure/databases/prisma/types';

const QUESTIONS_PER_AREA = 45;

const REVERSE_KNOWLEDGE_AREA_MAP: Record<KnowledgeArea, KnowledgeAreaLabelKey> =
  {
    LANGUAGES: 'languages',
    HUMANITIES: 'humanities',
    NATURAL_SCIENCES: 'naturalSciences',
    MATHEMATICS: 'mathematics',
  };

export class PrismaMockExamMapper implements Mapper<
  PrismaMockExamFull,
  MockExamDto
> {
  map(input: PrismaMockExamFull): MockExamDto {
    const performances = input.performances.reduce(
      (acc, p) => {
        const dtoKey = REVERSE_KNOWLEDGE_AREA_MAP[p.area];
        if (dtoKey) {
          acc[dtoKey] = this.calculateStatistics(p);
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
    p: PrismaMockExamFull['performances'][number],
  ): AreaPerformanceDto {
    const correct = p.correctCount;
    const wrong = QUESTIONS_PER_AREA - correct;
    const doubtTotal = p.doubtHits + p.doubtErrors;
    const criticalErrors = wrong - doubtTotal;

    const knowledgeGaps = Math.max(
      0,
      criticalErrors - p.distractionErrors - p.interpretationErrors,
    );

    return {
      id: p.id,
      area: p.area,
      statistics: {
        overallResult: {
          totalQuestions: QUESTIONS_PER_AREA,
          correctAnswers: correct,
          wrongAnswers: wrong,
          performanceRate: correct / QUESTIONS_PER_AREA,
        },
        qualityAssessment: {
          certaintyHits: p.certaintyCount,
          confidenceRate: correct > 0 ? p.certaintyCount / correct : 0,
          doubtHits: p.doubtHits,
          doubtErrors: p.doubtErrors,
          criticalErrors: criticalErrors,
        },
        errorAnalysis: {
          distractionErrors: p.distractionErrors,
          interpretationErrors: p.interpretationErrors,
          knowledgeGaps: knowledgeGaps,
        },
      },
    };
  }
}
