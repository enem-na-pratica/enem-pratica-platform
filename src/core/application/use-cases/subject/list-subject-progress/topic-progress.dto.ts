import {
  TopicDto,
  UserTopicProgressDto,
} from '@/src/core/application/common/dtos';

export type TopicProgressDto = {
  topic: Prettify<TopicDto>;
  progress: Prettify<UserTopicProgressDto | null>;
};
