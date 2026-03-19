import type { UserTopicProgressDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  Mapper,
  UserTopicProgressRepository,
} from '@/src/core/domain/contracts';
import { UserTopicProgress } from '@/src/core/domain/entities';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import type { SetTopicStatusDto } from './set-topic-status.dto';

type SetTopicStatusUseCaseDeps = {
  userTopicProgressRepository: UserTopicProgressRepository;
  userAccessService: UserAccessService;
  mapper: Mapper<UserTopicProgress, UserTopicProgressDto>;
};

export type SetTopicStatusInput = {
  data: SetTopicStatusDto;
  requester: Requester;
};

export class SetTopicStatusUseCase implements UseCase<
  SetTopicStatusInput,
  UserTopicProgressDto
> {
  private readonly topicProgressRepository: UserTopicProgressRepository;
  private readonly userAccessService: UserAccessService;
  private readonly mapper: Mapper<UserTopicProgress, UserTopicProgressDto>;

  constructor({
    userTopicProgressRepository,
    userAccessService,
    mapper,
  }: SetTopicStatusUseCaseDeps) {
    this.topicProgressRepository = userTopicProgressRepository;
    this.userAccessService = userAccessService;
    this.mapper = mapper;
  }

  async execute({
    data,
    requester,
  }: SetTopicStatusInput): Promise<UserTopicProgressDto> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetIdentifier: data.authorUsername,
    });

    return await this.persistEssay({ setTopicStatus: data, authorId });
  }

  private async persistEssay({
    setTopicStatus,
    authorId,
  }: {
    setTopicStatus: SetTopicStatusDto;
    authorId: string;
  }): Promise<UserTopicProgressDto> {
    const topicProgress = UserTopicProgress.create({
      authorId: authorId,
      topicId: setTopicStatus.topicId,
      status: setTopicStatus.status,
    });

    const createdTopicProgress =
      await this.topicProgressRepository.setProgress(topicProgress);

    return this.mapper.map(createdTopicProgress);
  }
}
