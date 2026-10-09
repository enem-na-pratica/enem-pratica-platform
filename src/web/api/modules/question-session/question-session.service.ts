import { HttpClient } from '@/src/web/api/shared';

import {
  QuestionSessionDto,
  QuestionSessionStatsDto,
  UserQuestionSessionsOverviewDto,
} from './question-session.dto';
import { QuestionSessionMapper } from './question-session.mapper';
import {
  QuestionSession,
  QuestionSessionStats,
  UserQuestionSessionsOverview,
} from './question-session.model';

type QuestionSessionServiceDeps = {
  httpClient: HttpClient;
};

export type CreateQuestionSessionDto = {
  topicId: string;
  date?: string;
  total: number;
  correct: number;
  isReviewed?: boolean;
};

export type SetIsReviewedDto = {
  questionSessionId: string;
  isReviewed: boolean;
};

export class QuestionSessionService {
  private readonly httpClient: HttpClient;

  constructor(deps: QuestionSessionServiceDeps) {
    this.httpClient = deps.httpClient;
  }

  async create({
    username,
    dataQuestionSession,
  }: {
    username: string;
    dataQuestionSession: CreateQuestionSessionDto;
  }): Promise<QuestionSession> {
    const data = await this.httpClient.post<QuestionSessionDto>({
      endpoint: '/question-sessions/users/:username',
      options: { data: dataQuestionSession, params: { username } },
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

  async getQuestionSessionStatsByAuthor(
    username: string,
  ): Promise<QuestionSessionStats> {
    const stats = await this.httpClient.get<QuestionSessionStatsDto>({
      endpoint: '/question-sessions/users/:username/stats',
      options: { params: { username } },
    });

    return QuestionSessionMapper.toStats(stats);
  }

  async listQuestionSessionsStatisticsForUser(
    username: string,
  ): Promise<UserQuestionSessionsOverview> {
    const data = await this.httpClient.get<UserQuestionSessionsOverviewDto>({
      endpoint: '/question-sessions/users/:username',
      options: { params: { username } },
    });

    return QuestionSessionMapper.toOverviewModel(data);
  }
}
