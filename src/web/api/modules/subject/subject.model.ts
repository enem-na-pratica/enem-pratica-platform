import { TopicStatus } from '@/src/web/config';

export type SubjectDto = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  createdAt: Date;
};

type TopicDto = {
  id: string;
  title: string;
  position: number;
  subjectId: string;
  createdAt: Date;
};

export type UserTopicProgressDto = {
  id: string;
  userId: string;
  topicId: string;
  status: TopicStatus;
  updatedAt: Date;
  createdAt: Date;
};

export type TopicProgressDto = {
  topic: TopicDto;
  progress: UserTopicProgressDto | null;
};
