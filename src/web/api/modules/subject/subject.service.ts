import type { HttpClient } from '@/src/web/api/shared';

import { SubjectDto, TopicProgressDto } from './subject.dto';
import { SubjectMapper } from './subject.mapper';
import { Subject, TopicProgress } from './subject.model';

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

  async listSubjectProgress({
    subjectSlug,
    username,
    status,
  }: {
    subjectSlug: string;
    username: string;
    status?: string[];
  }): Promise<TopicProgress[]> {
    const rawProgress = await this.httpClient.get<TopicProgressDto[]>({
      endpoint: `/subjects/:subjectSlug/users/:username/topics`,
      options: {
        params: { subjectSlug, username },
        query: status?.length ? { status } : undefined,
      },
    });

    return rawProgress.map((p) => SubjectMapper.toTopicProgressModel(p));
  }
}
