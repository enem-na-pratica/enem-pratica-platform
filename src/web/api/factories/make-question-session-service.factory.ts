import { makeFetchHttpClient } from '@/src/web/api/factories/http-client';
import { QuestionSessionService } from '@/src/web/api/modules/question-session';

export function makeQuestionSessionService() {
  return new QuestionSessionService({
    httpClient: makeFetchHttpClient(),
  });
}
