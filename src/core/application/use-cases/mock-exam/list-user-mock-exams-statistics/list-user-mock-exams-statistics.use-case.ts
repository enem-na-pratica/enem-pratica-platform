import type { MockExamDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import {
  KNOWLEDGE_AREA_MAP,
  KnowledgeAreaLabelKey,
} from '@/src/core/domain/entities';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import type { ListMockExamsByAuthorQuery } from './list-mock-exams-by-author.query';
import type {
  MockExamStatisticsDto,
  UserMockExamsOverviewDto,
} from './user-mock-exams-overview.dto';

export type ListUserMockExamsStatisticsInput = {
  authorUsername?: string;
  requester: Requester;
};

type ListUserMockExamsStatisticsUseCaseDeps = {
  userAccessService: UserAccessService;
  listMockExamsByAuthorQuery: ListMockExamsByAuthorQuery;
};

const KNOWLEDGE_AREA_KEYS = Object.keys(
  KNOWLEDGE_AREA_MAP,
) as KnowledgeAreaLabelKey[];

type AreaTotals = Record<
  KnowledgeAreaLabelKey,
  { performanceSum: number; correctSum: number; criticalSum: number }
>;

type AggregatedTotals = {
  sumGlobalPerformance: number;
  sumDistraction: number;
  sumInterpretation: number;
  sumKnowledgeGap: number;
  areaTotals: AreaTotals;
};

export class ListUserMockExamsStatisticsUseCase implements UseCase<
  ListUserMockExamsStatisticsInput,
  UserMockExamsOverviewDto
> {
  private readonly userAccessService: UserAccessService;
  private readonly listMockExamsByAuthorQuery: ListMockExamsByAuthorQuery;

  constructor({
    userAccessService,
    listMockExamsByAuthorQuery,
  }: ListUserMockExamsStatisticsUseCaseDeps) {
    this.userAccessService = userAccessService;
    this.listMockExamsByAuthorQuery = listMockExamsByAuthorQuery;
  }

  async execute({
    requester,
    authorUsername,
  }: ListUserMockExamsStatisticsInput): Promise<UserMockExamsOverviewDto> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetIdentifier: authorUsername,
    });

    const mockExams = await this.listMockExamsByAuthorQuery.execute(authorId);

    const statistics = this.calculateStatistics(mockExams);

    return { statistics, mockExams };
  }

  private calculateStatistics(mockExams: MockExamDto[]): MockExamStatisticsDto {
    const totalMockExams = mockExams.length;

    if (totalMockExams === 0) {
      return this.createEmptyStatistics();
    }

    const totals = this.aggregateTotals(mockExams);
    return this.mapTotalsToDto(totals, totalMockExams);
  }

  private aggregateTotals(mockExams: MockExamDto[]): AggregatedTotals {
    const totals: AggregatedTotals = {
      sumGlobalPerformance: 0,
      sumDistraction: 0,
      sumInterpretation: 0,
      sumKnowledgeGap: 0,
      areaTotals: this.initializeAreaTotals(),
    };

    mockExams.forEach((exam) => {
      KNOWLEDGE_AREA_KEYS.forEach((areaKey) => {
        const data = exam.performances[areaKey];
        const stats = data.statistics;

        totals.areaTotals[areaKey].performanceSum +=
          stats.overallResult.performanceRate;
        totals.areaTotals[areaKey].correctSum +=
          stats.overallResult.correctAnswers;
        totals.areaTotals[areaKey].criticalSum +=
          stats.qualityAssessment.criticalErrors;

        totals.sumGlobalPerformance += stats.overallResult.performanceRate;
        totals.sumDistraction += stats.errorAnalysis.distractionErrors;
        totals.sumInterpretation += stats.errorAnalysis.interpretationErrors;
        totals.sumKnowledgeGap += stats.errorAnalysis.knowledgeGapsErrors;
      });
    });

    return totals;
  }

  private mapTotalsToDto(
    totals: AggregatedTotals,
    totalMockExams: number,
  ): MockExamStatisticsDto {
    const totalDataPoints = totalMockExams * KNOWLEDGE_AREA_KEYS.length;

    return {
      totalMockExams,
      globalAveragePerformance: totals.sumGlobalPerformance / totalDataPoints,
      performancePerArea: KNOWLEDGE_AREA_KEYS.reduce(
        (acc, area) => {
          acc[area] = {
            averagePerformanceRate:
              totals.areaTotals[area].performanceSum / totalMockExams,
            averageCorrectAnswers:
              totals.areaTotals[area].correctSum / totalMockExams,
            totalCriticalErrors: totals.areaTotals[area].criticalSum,
          };
          return acc;
        },
        {} as MockExamStatisticsDto['performancePerArea'],
      ),
      errorPrevalence: {
        distractionAverage: totals.sumDistraction / totalMockExams,
        interpretationAverage: totals.sumInterpretation / totalMockExams,
        knowledgeGapAverage: totals.sumKnowledgeGap / totalMockExams,
      },
    };
  }

  private initializeAreaTotals(): AreaTotals {
    return KNOWLEDGE_AREA_KEYS.reduce((acc, area) => {
      acc[area] = { performanceSum: 0, correctSum: 0, criticalSum: 0 };
      return acc;
    }, {} as AreaTotals);
  }

  private createEmptyStatistics(): MockExamStatisticsDto {
    return {
      totalMockExams: 0,
      globalAveragePerformance: 0,

      performancePerArea: KNOWLEDGE_AREA_KEYS.reduce(
        (acc, area) => {
          acc[area] = {
            averagePerformanceRate: 0,
            averageCorrectAnswers: 0,
            totalCriticalErrors: 0,
          };
          return acc;
        },
        {} as MockExamStatisticsDto['performancePerArea'],
      ),

      errorPrevalence: {
        distractionAverage: 0,
        interpretationAverage: 0,
        knowledgeGapAverage: 0,
      },
    };
  }
}
