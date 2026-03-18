import { HttpClient } from '@/src/web/api/shared';

type QuestionSessionServiceDeps = {
  httpClient: HttpClient;
};

export class QuestionSessionService {
  private readonly httpClient: HttpClient;

  constructor(deps: QuestionSessionServiceDeps) {
    this.httpClient = deps.httpClient;
  }
}
