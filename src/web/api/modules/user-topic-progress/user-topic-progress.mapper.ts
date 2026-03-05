import type { TopicStatus } from '@/src/web/config';

import type { UserTopicProgressDto } from './user-topic-progress.dto';
import type { UserTopicProgress } from './user-topic-progress.model';

export const UserTopicProgressMapper = {
  toModel(dto: UserTopicProgressDto): UserTopicProgress {
    return {
      ...dto,
      status: dto.status as TopicStatus,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  },
};
