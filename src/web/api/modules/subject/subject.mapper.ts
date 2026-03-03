import type { TopicStatus } from '@/src/web/config';

import type { SubjectDto, TopicProgressDto } from './subject.dto';
import type { Subject, TopicProgress } from './subject.model';

export const SubjectMapper = {
  toModel(dto: SubjectDto): Subject {
    return {
      id: dto.id,
      name: dto.name,
      slug: dto.slug,
      category: dto.category,
      createdAt: new Date(dto.createdAt),
    };
  },

  toTopicProgressModel(dto: TopicProgressDto): TopicProgress {
    return {
      topic: {
        ...dto.topic,
        createdAt: new Date(dto.topic.createdAt),
      },
      progress: dto.progress
        ? {
            ...dto.progress,
            status: dto.progress.status as TopicStatus,
            createdAt: new Date(dto.progress.createdAt),
            updatedAt: new Date(dto.progress.updatedAt),
          }
        : null,
    };
  },
};
