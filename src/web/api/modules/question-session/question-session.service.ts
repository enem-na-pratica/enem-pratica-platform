import { HttpClient } from '@/src/web/api/shared';

import {
  QuestionSessionDto,
  UserQuestionSessionsOverviewDto,
} from './question-session.dto';
import { QuestionSessionMapper } from './question-session.mapper';
import {
  QuestionSession,
  UserQuestionSessionsOverview,
} from './question-session.model';

type QuestionSessionServiceDeps = {
  httpClient: HttpClient;
};

type CreateQuestionSessionDto = {
  authorUsername?: string;
  topicId: string;
  date?: string;
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
    const data = await this.httpClient.patch<QuestionSessionDto>({
      endpoint: '/question-sessions/:questionSessionId',
      options: { data: { isReviewed }, params: { questionSessionId } },
    });

    return QuestionSessionMapper.toModel(data);
  }

  async listMyQuestionSessionsStatistics(): Promise<UserQuestionSessionsOverview> {
    const data = await this.httpClient.get<UserQuestionSessionsOverviewDto>({
      endpoint: '/question-sessions',
    });

    return QuestionSessionMapper.toOverviewModel(data);
  }

  async listUserQuestionSessionsStatistics(
    username: string,
  ): Promise<UserQuestionSessionsOverview> {
    const data = await this.httpClient.get<UserQuestionSessionsOverviewDto>({
      endpoint: '/question-sessions/users/:username',
      options: { params: { username } },
    });

    return QuestionSessionMapper.toOverviewModel(data);
  }
}
