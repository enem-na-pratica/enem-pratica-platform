import type { Query } from '@/src/core/application/common/interfaces';

import type { TopicProgressDto } from './topic-progress.dto';

export type ListSubjectProgressByTargetUserQuery = Query<
  { targetUserId: string; subjectName: string },
  TopicProgressDto[]
>;
