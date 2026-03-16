import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import type { ListQuestionSessionsByAuthorQuery } from './list-question-session-by-author.query';
import type { UserQuestionSessionsOverviewDto } from './user-question-session-overview.dto';

type ListUserQuestionSessionsStatisticsUseCaseDeps = {
  userAccessService: UserAccessService;
  listQuestionSessionsByAuthorQuery: ListQuestionSessionsByAuthorQuery;
};

export type ListUserQuestionSessionsStatisticsInput = {
  authorUsername?: string;
  requester: Requester;
};

export class ListUserQuestionSessionsStatisticsUseCase implements UseCase<
  ListUserQuestionSessionsStatisticsInput,
  UserQuestionSessionsOverviewDto
> {
  private readonly userAccessService: UserAccessService;
  private readonly listQuestionSessionsByAuthorQuery: ListQuestionSessionsByAuthorQuery;

  constructor({
    userAccessService,
    listQuestionSessionsByAuthorQuery,
  }: ListUserQuestionSessionsStatisticsUseCaseDeps) {
    this.userAccessService = userAccessService;
    this.listQuestionSessionsByAuthorQuery = listQuestionSessionsByAuthorQuery;
  }

  async execute({
    requester,
    authorUsername,
  }: ListUserQuestionSessionsStatisticsInput): Promise<UserQuestionSessionsOverviewDto> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetUsername: authorUsername,
    });
    const listQuestionSessions =
      await this.listQuestionSessionsByAuthorQuery.execute(authorId);
    throw new Error('Method not implemented.');
  }
}
