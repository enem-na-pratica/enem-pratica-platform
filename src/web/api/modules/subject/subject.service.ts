import type { HttpClient } from '@/src/web/api/shared';

import { SubjectDto } from './subject.dto';
import { SubjectMapper } from './subject.mapper';
import { Subject } from './subject.model';

type SubjectServiceDeps = {
  httpClient: HttpClient;
};

export class SubjectService {
  private readonly httpClient: HttpClient;

  constructor(deps: SubjectServiceDeps) {
    this.httpClient = deps.httpClient;
  }

  async listSubjects(): Promise<Subject[]> {
    const rawSubjects = await this.httpClient.get<SubjectDto[]>({
      endpoint: '/subjects',
    });

    return rawSubjects.map((s) => SubjectMapper.toModel(s));
  }
}
