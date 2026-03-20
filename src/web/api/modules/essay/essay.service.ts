import { HttpClient } from '@/src/web/api/shared';

import type { EssayDto, UserEssaysOverviewDto } from './essay.dto';
import { EssayMapper } from './essay.mapper';
import type { Essay, UserEssaysOverview } from './essay.model';

type EssayServiceDeps = {
  httpClient: HttpClient;
};

type CreateEssayDto = {
  authorUsername?: string;
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

  async create(dataEssay: CreateEssayDto): Promise<Essay> {
    const data = await this.httpClient.post<EssayDto>({
      endpoint: '/essays',
      options: { data: dataEssay },
    });

    return EssayMapper.toModel(data);
  }

  async listUserEssaysStatistics(
    username: string,
  ): Promise<UserEssaysOverview> {
    const data = await this.httpClient.get<UserEssaysOverviewDto>({
      endpoint: '/essays/users/:username',
      options: { params: { username } },
    });

    return EssayMapper.toOverviewModel(data);
  }
}
