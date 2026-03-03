import type { UseCase } from '@/src/core/application/common/interfaces';
import type { TopicStatus } from '@/src/core/domain/entities';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import { ListSubjectProgressByTargetUserQuery } from './list-subject-progress-by-target-user.query';
import type { TopicProgressDto } from './topic-progress.dto';

export type ListSubjectProgressInput = {
  targetUsername?: string;
  subjectSlug: string;
  requester: Requester;
  status?: TopicStatus[];
};

type ListSubjectProgressUseCaseDeps = {
  userAccessService: UserAccessService;
  listSubjectProgressByTargetUserQuery: ListSubjectProgressByTargetUserQuery;
};

export class ListSubjectProgressUseCase implements UseCase<
  ListSubjectProgressInput,
  TopicProgressDto[]
> {
  private readonly userAccessService: UserAccessService;
  private readonly listSubjectProgressByTargetUserQuery: ListSubjectProgressByTargetUserQuery;

  constructor({
    userAccessService,
    listSubjectProgressByTargetUserQuery,
  }: ListSubjectProgressUseCaseDeps) {
    this.userAccessService = userAccessService;
    this.listSubjectProgressByTargetUserQuery =
      listSubjectProgressByTargetUserQuery;
  }

  async execute({
    requester,
    subjectSlug,
    targetUsername,
    status,
  }: ListSubjectProgressInput): Promise<TopicProgressDto[]> {
    const targetUserId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetUsername,
    });

    return this.listSubjectProgressByTargetUserQuery.execute({
      targetUserId,
      subjectSlug,
      status,
    });
  }
}
