import type { UseCase } from '@/src/core/application/common/interfaces';
import {
  KNOWLEDGE_AREA_MAP,
  type KnowledgeArea,
  type KnowledgeAreaLabelKey,
} from '@/src/core/domain/entities';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import type { GetMockExamsRawAggregateQuery } from './get-mock-exams-raw-aggregate.query';
import type {
  AreaAggregateRaw,
  MockExamStatsDto,
  MockExamsRawAggregate,
} from './mock-exam-stats.dto';

const QUESTIONS_PER_AREA = 45;

const KNOWLEDGE_AREA_KEYS = Object.keys(
  KNOWLEDGE_AREA_MAP,
) as KnowledgeAreaLabelKey[];

export type GetAuthorMockExamStatsInput = {
  authorUsername?: string;
  requester: Requester;
};

type GetAuthorMockExamStatsDeps = {
  userAccessService: UserAccessService;
  getMockExamsRawAggregateQuery: GetMockExamsRawAggregateQuery;
};

export class GetAuthorMockExamStatsUseCase implements UseCase<
  GetAuthorMockExamStatsInput,
  MockExamStatsDto
> {
  private readonly userAccessService: UserAccessService;
  private readonly getMockExamsRawAggregateQuery: GetMockExamsRawAggregateQuery;

  constructor({
    userAccessService,
    getMockExamsRawAggregateQuery,
  }: GetAuthorMockExamStatsDeps) {
    this.userAccessService = userAccessService;
    this.getMockExamsRawAggregateQuery = getMockExamsRawAggregateQuery;
  }

  async execute({
    requester,
    authorUsername,
  }: GetAuthorMockExamStatsInput): Promise<MockExamStatsDto> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetIdentifier: authorUsername,
    });

    const rawAggregate =
      await this.getMockExamsRawAggregateQuery.execute(authorId);

    return this.buildStatistics(rawAggregate);
  }

  private buildStatistics({
    totalMockExams,
    areaAggregates,
  }: MockExamsRawAggregate): MockExamStatsDto {
    if (totalMockExams === 0) {
      return this.createEmptyStatistics();
    }

    const { performancePerArea, errorSums } = this.aggregateAreaMetrics(
      totalMockExams,
      areaAggregates,
    );

    const totalDataPoints = totalMockExams * KNOWLEDGE_AREA_KEYS.length;

    return {
      totalMockExams,
      globalAveragePerformance:
        errorSums.sumGlobalPerformance / totalDataPoints,
      performancePerArea,
      errorPrevalence: {
        distractionAverage: errorSums.sumDistraction / totalMockExams,
        interpretationAverage: errorSums.sumInterpretation / totalMockExams,
        knowledgeGapAverage: errorSums.sumKnowledgeGap / totalMockExams,
      },
    };
  }

  private aggregateAreaMetrics(
    totalMockExams: number,
    areaAggregates: AreaAggregateRaw[],
  ) {
    let sumGlobalPerformance = 0;
    let sumDistraction = 0;
    let sumInterpretation = 0;
    let sumKnowledgeGap = 0;

    const performancePerArea = {} as MockExamStatsDto['performancePerArea'];

    for (const areaKey of KNOWLEDGE_AREA_KEYS) {
      const areaEnum = KNOWLEDGE_AREA_MAP[areaKey];
      const areaSums = this.calculateAreaMetrics(areaEnum, areaAggregates);

      performancePerArea[areaKey] = this.buildAreaPerformance(
        areaSums,
        totalMockExams,
      );

      sumGlobalPerformance += areaSums.performanceSum;
      sumDistraction += areaSums.distraction;
      sumInterpretation += areaSums.interpretation;
      sumKnowledgeGap += areaSums.knowledgeGap;
    }

    return {
      performancePerArea,
      errorSums: {
        sumGlobalPerformance,
        sumDistraction,
        sumInterpretation,
        sumKnowledgeGap,
      },
    };
  }

  private calculateAreaMetrics(
    areaEnum: KnowledgeArea,
    areaAggregates: AreaAggregateRaw[],
  ) {
    const aggregate = areaAggregates.find((item) => item.area === areaEnum);
    return this.deriveAreaSums(aggregate);
  }

  private buildAreaPerformance(
    areaSums: ReturnType<typeof this.deriveAreaSums>,
    totalMockExams: number,
  ) {
    return {
      averagePerformanceRate: areaSums.performanceSum / totalMockExams,
      averageCorrectAnswers: areaSums.correctSum / totalMockExams,
      totalCriticalErrors: areaSums.criticalSum,
    };
  }

  private deriveAreaSums(aggregate: AreaAggregateRaw | undefined) {
    if (!aggregate) {
      return {
        performanceSum: 0,
        correctSum: 0,
        criticalSum: 0,
        distraction: 0,
        interpretation: 0,
        knowledgeGap: 0,
      };
    }

    const {
      count,
      sumCorrectCount,
      sumDoubtErrors,
      sumDistractionErrors,
      sumInterpretationErrors,
    } = aggregate;

    const wrongSum = count * QUESTIONS_PER_AREA - sumCorrectCount;

    return {
      performanceSum: sumCorrectCount / QUESTIONS_PER_AREA,
      correctSum: sumCorrectCount,
      criticalSum: wrongSum - sumDoubtErrors,
      distraction: sumDistractionErrors,
      interpretation: sumInterpretationErrors,
      knowledgeGap: wrongSum - sumDistractionErrors - sumInterpretationErrors,
    };
  }

  private createEmptyStatistics(): MockExamStatsDto {
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
        {} as MockExamStatsDto['performancePerArea'],
      ),
      errorPrevalence: {
        distractionAverage: 0,
        interpretationAverage: 0,
        knowledgeGapAverage: 0,
      },
    };
  }
}
