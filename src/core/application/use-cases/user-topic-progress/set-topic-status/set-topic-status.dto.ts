import type { TopicStatus } from '@/src/core/domain/entities/user-topic-progress.entity';

export type SetTopicStatusDto = {
  authorUsername?: string;
  topicId: string;
  status: TopicStatus;
};
