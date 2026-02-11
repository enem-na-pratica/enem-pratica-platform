import type { UseCase } from '@/src/core/application/common/interfaces';
import type { UserAccessService, Requester } from '@/src/core/domain/services';
import type {
  UserMockExamsOverviewDto,
  MockExamStatisticsDto
} from './user-mock-exams-overview.dto';
import type { ListMockExamsByAuthorQuery } from './list-mock-exams-by-author.query';
import type { MockExamDto } from "@/src/core/application/common/dtos";
import { KNOWLEDGE_AREA_MAP, KnowledgeAreaLabelKey } from '@/src/core/domain/entities';

export type ListUserEssaysStatisticsInput = {
  authorUsername?: string;
  requester: Requester;
};

type ListUserMockExamsStatisticsUseCaseDeps = {
  userAccessService: UserAccessService;
  listMockExamsByAuthorQuery: ListMockExamsByAuthorQuery;
}

const KNOWLEDGE_AREA_KEYS = Object.keys(
  KNOWLEDGE_AREA_MAP
) as KnowledgeAreaLabelKey[];

export class ListUserMockExamsStatisticsUseCase
  implements UseCase<ListUserEssaysStatisticsInput, UserMockExamsOverviewDto> {
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
    authorUsername
  }: ListUserEssaysStatisticsInput
  ): Promise<UserMockExamsOverviewDto> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetUsername: authorUsername
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

    let sumGlobalPerformance = 0;
    let sumDistraction = 0;
    let sumInterpretation = 0;
    let sumKnowledgeGap = 0;

    const areaTotals = KNOWLEDGE_AREA_KEYS.reduce((acc, area) => {
      acc[area] = { performanceSum: 0, correctSum: 0, criticalSum: 0 };
      return acc;
    }, {} as Record<KnowledgeAreaLabelKey, { performanceSum: number; correctSum: number; criticalSum: number }>);

    mockExams.forEach((exam) => {
      KNOWLEDGE_AREA_KEYS.forEach((areaKey) => {
        const data = exam.performances[areaKey];

        areaTotals[areaKey].performanceSum += data.statistics.overallResult.performanceRate;
        areaTotals[areaKey].correctSum += data.statistics.overallResult.correctAnswers;
        areaTotals[areaKey].criticalSum += data.statistics.qualityAssessment.criticalErrors;

        sumGlobalPerformance += data.statistics.overallResult.performanceRate;
        sumDistraction += data.statistics.errorAnalysis.distractionErrors;
        sumInterpretation += data.statistics.errorAnalysis.interpretationErrors;
        sumKnowledgeGap += data.statistics.errorAnalysis.knowledgeGaps;
      });
    });

    const totalDataPoints = totalMockExams * KNOWLEDGE_AREA_KEYS.length;

    return {
      totalMockExams,
      globalAveragePerformance: sumGlobalPerformance / totalDataPoints,
      performancePerArea: KNOWLEDGE_AREA_KEYS.reduce((acc, area) => {
        acc[area] = {
          averagePerformanceRate: areaTotals[area].performanceSum / totalMockExams,
          averageCorrectAnswers: areaTotals[area].correctSum / totalMockExams,
          totalCriticalErrors: areaTotals[area].criticalSum,
        };
        return acc;
      }, {} as MockExamStatisticsDto["performancePerArea"]),
      errorPrevalence: {
        distractionAverage: sumDistraction / totalMockExams,
        interpretationAverage: sumInterpretation / totalMockExams,
        knowledgeGapAverage: sumKnowledgeGap / totalMockExams,
      },
    };
  }

  private createEmptyStatistics(): MockExamStatisticsDto {
    return {
      totalMockExams: 0,
      globalAveragePerformance: 0,

      performancePerArea: KNOWLEDGE_AREA_KEYS.reduce((acc, area) => {
        acc[area] = {
          averagePerformanceRate: 0,
          averageCorrectAnswers: 0,
          totalCriticalErrors: 0,
        };
        return acc;
      }, {} as MockExamStatisticsDto["performancePerArea"]),

      errorPrevalence: {
        distractionAverage: 0,
        interpretationAverage: 0,
        knowledgeGapAverage: 0,
      },
    };
  }
}