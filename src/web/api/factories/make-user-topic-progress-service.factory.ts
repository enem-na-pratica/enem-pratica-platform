import { makeFetchHttpClient } from '@/src/web/api/factories/http-client';
import { UserTopicProgressService } from '@/src/web/api/modules/user-topic-progress';

export function makeUserTopicProgressService() {
  return new UserTopicProgressService({
    httpClient: makeFetchHttpClient(),
  });
}
