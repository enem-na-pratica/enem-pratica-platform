import type { EssayDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import type { ListAuthorEssaysQuery } from './list-author-essays.query';

export type ListAuthorEssaysInput = {
  authorUsername?: string;
  requester: Requester;
};

type ListAuthorEssaysUseCaseDeps = {
  userAccessService: UserAccessService;
  listAuthorEssaysQuery: ListAuthorEssaysQuery;
};

export class ListAuthorEssaysUseCase implements UseCase<
  ListAuthorEssaysInput,
  EssayDto[]
> {
  private readonly userAccessService: UserAccessService;
  private readonly listAuthorEssaysQuery: ListAuthorEssaysQuery;

  constructor({
    userAccessService,
    listAuthorEssaysQuery,
  }: ListAuthorEssaysUseCaseDeps) {
    this.userAccessService = userAccessService;
    this.listAuthorEssaysQuery = listAuthorEssaysQuery;
  }

  async execute({
    authorUsername,
    requester,
  }: ListAuthorEssaysInput): Promise<EssayDto[]> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetIdentifier: authorUsername,
    });

    const essays = await this.listAuthorEssaysQuery.execute(authorId);

    return essays;
  }
}
