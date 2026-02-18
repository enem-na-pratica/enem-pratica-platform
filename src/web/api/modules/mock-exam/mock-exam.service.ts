import type { HttpClient } from '@/src/web/api/shared';

import type { MockExamDto } from './mock-exam.dto';
import { MockExamMapper } from './mock-exam.mapper';
import type { KnowledgeAreaLabelKey, MockExam } from './mock-exam.model';

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

    return MockExamMapper.toDomain(data);
  }
}
