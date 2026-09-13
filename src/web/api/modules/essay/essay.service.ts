import type { HttpClient } from '@/src/web/api/shared';

import type {
  EssayDto,
  EssayStatsDto,
  UserEssaysOverviewDto,
} from './essay.dto';
import { EssayMapper } from './essay.mapper';
import type { Essay, EssayStats, UserEssaysOverview } from './essay.model';

type EssayServiceDeps = {
  httpClient: HttpClient;
};

type CreateEssayDto = {
  theme: string;
  grades: {
    c1: number;
    c2: number;
    c3: number;
    c4: number;
    c5: number;
  };
};

export class EssayService {
  private readonly httpClient: HttpClient;

  constructor(deps: EssayServiceDeps) {
    this.httpClient = deps.httpClient;
  }

  async create({
    username,
    dataEssay,
  }: {
    username: string;
    dataEssay: CreateEssayDto;
  }): Promise<Essay> {
    const data = await this.httpClient.post<EssayDto>({
      endpoint: '/essays/users/:username',
      options: { data: dataEssay, params: { username } },
    });

    return EssayMapper.toModel(data);
  }

  async getEssaysByAuthor(username: string): Promise<EssayStats> {
    const stats = await this.httpClient.get<EssayStatsDto>({
      endpoint: '/essays/users/:username/stats',
      options: { params: { username } },
    });

    return EssayMapper.toStats(stats);
  }

  async listEssaysStatisticsForUser(
    username: string,
  ): Promise<UserEssaysOverview> {
    const data = await this.httpClient.get<UserEssaysOverviewDto>({
      endpoint: '/essays/users/:username',
      options: { params: { username } },
    });

    return EssayMapper.toOverviewModel(data);
  }
}
