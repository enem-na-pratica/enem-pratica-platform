import type {
  AreaPerformanceDto,
  MockExamDto,
  UserMockExamsOverviewDto,
} from './mock-exam.dto';
import type {
  AreaPerformance,
  KnowledgeArea,
  KnowledgeAreaLabelKey,
  MockExam,
  UserMockExamsOverview,
} from './mock-exam.model';

export const MockExamMapper = {
  toDomain(dto: MockExamDto): MockExam {
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

  toOverviewDomain(dto: UserMockExamsOverviewDto): UserMockExamsOverview {
    return {
      ...dto,
      mockExams: dto.mockExams.map((exam) => this.toDomain(exam)),
    };
  },
};
