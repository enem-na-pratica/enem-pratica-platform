import { TopicStatus } from '@/src/web/config';

export type UserTopicProgress = {
  id: string;
  authorId: string;
  topicId: string;
  status: TopicStatus;
  updatedAt: Date;
  createdAt: Date;
};
