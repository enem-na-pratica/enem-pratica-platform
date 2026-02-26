import type { Query } from '@/src/core/application/common/interfaces';

import type { TopicProgressDto } from './topic-progress.dto';

export type ListSubjectProgressByTargetQuery = Query<
  { targetId: string; subjectName: string },
  TopicProgressDto[]
>;
