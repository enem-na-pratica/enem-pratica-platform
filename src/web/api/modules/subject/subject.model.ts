import { TopicStatus } from '@/src/web/config';

export type Subject = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  createdAt: Date;
};

export type Topic = {
  id: string;
  title: string;
  position: number;
  subjectId: string;
  createdAt: Date;
};

export type UserTopicProgress = {
  id: string;
  userId: string;
  topicId: string;
  status: TopicStatus;
  updatedAt: Date;
  createdAt: Date;
};

export type TopicProgress = {
  topic: Topic;
  progress: UserTopicProgress | null;
};
