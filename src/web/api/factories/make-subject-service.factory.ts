import { makeFetchHttpClient } from '@/src/web/api/factories/http-client';
import { SubjectService } from '@/src/web/api/modules/subject';

export function makeSubjectService() {
  return new SubjectService({
    httpClient: makeFetchHttpClient(),
  });
}
