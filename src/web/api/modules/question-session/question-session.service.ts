import { HttpClient } from '@/src/web/api/shared';

import { QuestionSessionDto } from './question-session.dto';
import { QuestionSessionMapper } from './question-session.mapper';
import { QuestionSession } from './question-session.model';

type QuestionSessionServiceDeps = {
  httpClient: HttpClient;
};

type CreateQuestionSessionDto = {
  authorUsername?: string;
  topicId: string;
  date?: Date;
  total: number;
  correct: number;
  isReviewed?: boolean;
};

type SetIsReviewedDto = {
  questionSessionId: string;
  isReviewed: boolean;
};

export class QuestionSessionService {
  private readonly httpClient: HttpClient;

  constructor(deps: QuestionSessionServiceDeps) {
    this.httpClient = deps.httpClient;
  }

  async create(
    dataQuestionSession: CreateQuestionSessionDto,
  ): Promise<QuestionSession> {
    const data = await this.httpClient.post<QuestionSessionDto>({
      endpoint: '/question-sessions',
      options: { data: dataQuestionSession },
    });

    return QuestionSessionMapper.toModel(data);
  }

  async setIsReviewed({
    isReviewed,
    questionSessionId,
  }: SetIsReviewedDto): Promise<QuestionSession> {
    const data = await this.httpClient.post<QuestionSessionDto>({
      endpoint: '/question-sessions/:questionSessionId',
      options: { data: { isReviewed }, params: { questionSessionId } },
    });

    return QuestionSessionMapper.toModel(data);
  }
}
