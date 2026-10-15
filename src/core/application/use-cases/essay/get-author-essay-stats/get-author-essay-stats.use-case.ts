import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import type { EssayStatsDto } from './essay-stats.dto';
import type { GetAuthorEssaysStatsQuery } from './get-author-essay-stats.query';

export type GetEssaysStatsByUserInput = {
  authorUsername?: string;
  requester: Requester;
};

type GetAuthorEssaysStatsUseCaseDeps = {
  userAccessService: UserAccessService;
  getAuthorEssaysStatsQuery: GetAuthorEssaysStatsQuery;
};

export class GetAuthorEssaysStatsUseCase implements UseCase<
  GetEssaysStatsByUserInput,
  EssayStatsDto
> {
  private readonly userAccessService: UserAccessService;
  private readonly getAuthorEssaysStatsQuery: GetAuthorEssaysStatsQuery;

  constructor({
    userAccessService,
    getAuthorEssaysStatsQuery,
  }: GetAuthorEssaysStatsUseCaseDeps) {
    this.userAccessService = userAccessService;
    this.getAuthorEssaysStatsQuery = getAuthorEssaysStatsQuery;
  }

  async execute({
    requester,
    authorUsername,
  }: GetEssaysStatsByUserInput): Promise<EssayStatsDto> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetIdentifier: authorUsername,
    });

    const { averagesPerCompetency, totalCount } =
      await this.getAuthorEssaysStatsQuery.execute(authorId);

    return {
      totalCount,
      globalAverage: this.calculateGlobalAverage(averagesPerCompetency),
      averagesPerCompetency,
    };
  }

  private calculateGlobalAverage(averages: Record<string, number>): number {
    return Object.values(averages).reduce((acc, value) => acc + value, 0);
  }
}
