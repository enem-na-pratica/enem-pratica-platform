import { makeFetchHttpClient } from '@/src/web/api/factories/http-client';
import { MockExamService } from '@/src/web/api/modules/mock-exam';

export function makeMockExamService() {
  return new MockExamService({
    httpClient: makeFetchHttpClient(),
  });
}
