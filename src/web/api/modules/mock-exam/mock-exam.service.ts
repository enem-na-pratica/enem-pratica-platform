import type { HttpClient } from '@/src/web/api/shared';

import type { MockExamDto, UserMockExamsOverviewDto } from './mock-exam.dto';
import { MockExamMapper } from './mock-exam.mapper';
import type {
  KnowledgeAreaLabelKey,
  MockExam,
  UserMockExamsOverview,
} from './mock-exam.model';

type MockExamServiceDeps = {
  httpClient: HttpClient;
};

type CreateMockExamDto = {
  authorUsername?: string;
  title: string;
  performances: Record<
    KnowledgeAreaLabelKey,
    {
      correctCount: number;
      certaintyCount: number;
      doubtHits: number;
      doubtErrors: number;
      distractionErrors: number;
      interpretationErrors: number;
    }
  >;
};

export class MockExamService {
  private readonly httpClient: HttpClient;

  constructor(deps: MockExamServiceDeps) {
    this.httpClient = deps.httpClient;
  }

  async create(dataMockExam: CreateMockExamDto): Promise<MockExam> {
    const data = await this.httpClient.post<MockExamDto>({
      endpoint: '/mock-exams',
      options: { data: dataMockExam },
    });

    return MockExamMapper.toModel(data);
  }

  async listUserMockExamsStatistics(
    username: string,
  ): Promise<UserMockExamsOverview> {
    const data = await this.httpClient.get<UserMockExamsOverviewDto>({
      endpoint: '/mock-exams/:username',
      options: { params: { username } },
    });

    return MockExamMapper.toOverviewModel(data);
  }
}
