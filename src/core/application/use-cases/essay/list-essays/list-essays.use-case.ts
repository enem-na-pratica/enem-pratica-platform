import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import {
  EssayPaginatedResponse,
  EssayPaginationParams,
} from './list-essays.contracts';
import type { ListEssaysQuery } from './list-essays.query';

export type ListEssaysInput = {
  essayPaginationParams: EssayPaginationParams;
  requester: Requester;
};

type ListEssaysUseCaseDeps = {
  userAccessService: UserAccessService;
  listEssaysQuery: ListEssaysQuery;
};

export class ListEssaysUseCase implements UseCase<
  ListEssaysInput,
  EssayPaginatedResponse
> {
  private readonly userAccessService: UserAccessService;
  private readonly listEssaysQuery: ListEssaysQuery;

  constructor({ userAccessService, listEssaysQuery }: ListEssaysUseCaseDeps) {
    this.userAccessService = userAccessService;
    this.listEssaysQuery = listEssaysQuery;
  }

  async execute({
    essayPaginationParams,
    requester,
  }: ListEssaysInput): Promise<EssayPaginatedResponse> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetIdentifier: essayPaginationParams.filters.authorId,
    });

    const { startDate, endDate } = essayPaginationParams.filters;

    const adjustedStartDate = startDate ? new Date(startDate) : undefined;
    if (adjustedStartDate) {
      adjustedStartDate.setHours(0, 0, 0, 0);
    }

    const adjustedEndDate = endDate ? new Date(endDate) : undefined;
    if (adjustedEndDate) {
      adjustedEndDate.setHours(23, 59, 59, 999);
    }

    const resolvedParams: EssayPaginationParams = {
      ...essayPaginationParams,
      filters: {
        ...essayPaginationParams.filters,
        authorId,
        ...(adjustedStartDate && { startDate: adjustedStartDate }),
        ...(adjustedEndDate && { endDate: adjustedEndDate }),
      },
    };

    const { items, totalItems } =
      await this.listEssaysQuery.execute(resolvedParams);

    const { page, limit } = resolvedParams;

    return this.buildPaginatedResponse({
      items,
      totalItems,
      page,
      limit,
    });
  }

  private buildPaginatedResponse({
    items,
    totalItems,
    page,
    limit,
  }: {
    items: EssayPaginatedResponse['data'];
    totalItems: number;
    page: number;
    limit: number;
  }): EssayPaginatedResponse {
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: items,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}
