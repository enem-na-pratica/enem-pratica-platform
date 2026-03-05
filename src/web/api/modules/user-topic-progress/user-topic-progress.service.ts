import type { HttpClient } from '@/src/web/api/shared';
import { TopicStatus } from '@/src/web/config';

import type { UserTopicProgressDto } from './user-topic-progress.dto';
import { UserTopicProgressMapper } from './user-topic-progress.mapper';
import type { UserTopicProgress } from './user-topic-progress.model';

type UserTopicProgressServiceDeps = {
  httpClient: HttpClient;
};

export class UserTopicProgressService {
  private readonly httpClient: HttpClient;

  constructor(deps: UserTopicProgressServiceDeps) {
    this.httpClient = deps.httpClient;
  }
}
