import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import { ListSubjectProgressByTargetQuery } from './list-subject-progress-by-target.query';
import type { TopicProgressDto } from './topic-progress.dto';

export type ListSubjectProgressInput = {
  targetUsername?: string;
  subjectName: string;
  requester: Requester;
};

type ListSubjectProgressUseCaseDeps = {
  userAccessService: UserAccessService;
  listSubjectProgressByTargetQuery: ListSubjectProgressByTargetQuery;
};

export class ListSubjectProgressUseCase implements UseCase<
  ListSubjectProgressInput,
  TopicProgressDto[]
> {
  private readonly userAccessService: UserAccessService;
  private readonly listSubjectProgressByTargetQuery: ListSubjectProgressByTargetQuery;

  constructor({
    userAccessService,
    listSubjectProgressByTargetQuery,
  }: ListSubjectProgressUseCaseDeps) {
    this.userAccessService = userAccessService;
    this.listSubjectProgressByTargetQuery = listSubjectProgressByTargetQuery;
  }

  async execute({
    requester,
    subjectName,
    targetUsername,
  }: ListSubjectProgressInput): Promise<TopicProgressDto[]> {
    const targetId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetUsername,
    });

    return this.listSubjectProgressByTargetQuery.execute({
      targetId,
      subjectName,
    });
  }
}
