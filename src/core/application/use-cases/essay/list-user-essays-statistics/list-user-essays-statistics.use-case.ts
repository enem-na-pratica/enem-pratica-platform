import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  UserEssaysOverviewDto,
  EssayStatisticsDto
} from './user-essays-overview.dto';
import type { ListEssaysByAuthorQuery } from './list-essays-by-author.query';
import type { EssayDto } from "@/src/core/application/common/dtos";
import type { UserAccessService, Requester } from '@/src/core/domain/services';

export type ListUserEssaysStatisticsInput = {
  authorUsername?: string;
  requester: Requester;
};

type ListUserEssaysStatisticsUseCaseDeps = {
  userAccessService: UserAccessService;
  listEssaysByAuthorQuery: ListEssaysByAuthorQuery;
}

export class ListUserEssaysStatisticsUseCase
  implements UseCase<ListUserEssaysStatisticsInput, UserEssaysOverviewDto> {
  private readonly userAccessService: UserAccessService;
  private readonly listEssaysByAuthorQuery: ListEssaysByAuthorQuery;

  constructor({
    userAccessService,
    listEssaysByAuthorQuery,
  }: ListUserEssaysStatisticsUseCaseDeps) {
    this.userAccessService = userAccessService;
    this.listEssaysByAuthorQuery = listEssaysByAuthorQuery;
  }

  async execute({
    authorUsername,
    requester
  }: ListUserEssaysStatisticsInput): Promise<UserEssaysOverviewDto> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetUsername: authorUsername
    });

    const essays = await this.listEssaysByAuthorQuery.execute(authorId);

    const statistics = this.calculateStatistics(essays);

    return { statistics, essays };
  }

  private calculateStatistics(essays: EssayDto[]): EssayStatisticsDto {
    const totalCount = essays.length;

    if (totalCount === 0) {
      return {
        totalCount: 0,
        globalAverage: 0,
        averagesPerCompetency: { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 },
      };
    }

    const initialTotals = { total: 0, c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 };

    const totals = essays.reduce((acc, curr) => {
      (Object.keys(acc) as (keyof typeof acc)[]).forEach(key => {
        acc[key] += curr.grades[key];
      });
      return acc;
    }, { ...initialTotals });

    return {
      totalCount,
      globalAverage: totals.total / totalCount,
      averagesPerCompetency: {
        c1: totals.c1 / totalCount,
        c2: totals.c2 / totalCount,
        c3: totals.c3 / totalCount,
        c4: totals.c4 / totalCount,
        c5: totals.c5 / totalCount,
      },
    };
  }
}
