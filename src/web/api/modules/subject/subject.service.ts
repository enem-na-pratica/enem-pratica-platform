import type { HttpClient } from '@/src/web/api/shared';

type SubjectServiceDeps = {
  httpClient: HttpClient;
};

export class SubjectService {
  private readonly httpClient: HttpClient;

  constructor(deps: SubjectServiceDeps) {
    this.httpClient = deps.httpClient;
  }
}
