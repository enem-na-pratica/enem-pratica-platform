export type SubjectDto = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  createdAt: string;
};

export type TopicDto = {
  id: string;
  title: string;
  position: number;
  subjectId: string;
  createdAt: string;
};

export type UserTopicProgressDto = {
  id: string;
  userId: string;
  topicId: string;
  status: string;
  updatedAt: string;
  createdAt: string;
};

export type TopicProgressDto = {
  topic: TopicDto;
  progress: UserTopicProgressDto | null;
};
