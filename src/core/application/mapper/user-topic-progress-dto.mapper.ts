import type { UserTopicProgressDto } from '@/src/core/application/common/dtos';
import type { Mapper } from '@/src/core/domain/contracts/mappers/mapper.interface';
import type { UserTopicProgress } from '@/src/core/domain/entities';

export class UserTopicProgressDtoMapper implements Mapper<
  UserTopicProgress,
  UserTopicProgressDto
> {
  public map(userTopicProgress: UserTopicProgress): UserTopicProgressDto {
    return {
      id: userTopicProgress.id!,
      userId: userTopicProgress.userId,
      topicId: userTopicProgress.topicId,
      status: userTopicProgress.status,
      updatedAt: userTopicProgress.updatedAt.toISOString(),
      createdAt: userTopicProgress.createdAt.toISOString(),
    };
  }
}
