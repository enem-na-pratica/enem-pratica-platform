import type { HttpClient } from '@/src/web/api/shared';

import type { MockExamDto, MockExamStatsDto } from './mock-exam.dto';
import { MockExamMapper } from './mock-exam.mapper';
import type {
  KnowledgeAreaLabelKey,
  MockExam,
  MockExamStats,
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

  async getMockExamStatsByAuthor(username: string): Promise<MockExamStats> {
    const stats = await this.httpClient.get<MockExamStatsDto>({
      endpoint: '/mock-exams/users/:username/stats',
      options: { params: { username } },
    });

    return MockExamMapper.toStats(stats);
  }

  async listMockExamsByAuthor(username: string): Promise<MockExam[]> {
    const mockExams = await this.httpClient.get<MockExamDto[]>({
      endpoint: '/mock-exams/users/:username',
      options: { params: { username } },
    });

    return mockExams.map((essay) => MockExamMapper.toModel(essay));
  }
}
