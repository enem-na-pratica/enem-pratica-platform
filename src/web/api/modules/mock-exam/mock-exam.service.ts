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

  async create({
    username,
    dataMockExam,
  }: {
    username: string;
    dataMockExam: CreateMockExamDto;
  }): Promise<MockExam> {
    const data = await this.httpClient.post<MockExamDto>({
      endpoint: '/mock-exams/users/:username',
      options: { data: dataMockExam, params: { username } },
    });

    return MockExamMapper.toModel(data);
  }

  async listMockExamsStatisticsForUser(
    username: string,
  ): Promise<UserMockExamsOverview> {
    const data = await this.httpClient.get<UserMockExamsOverviewDto>({
      endpoint: '/mock-exams/users/:username',
      options: { params: { username } },
    });

    return MockExamMapper.toOverviewModel(data);
  }
}
