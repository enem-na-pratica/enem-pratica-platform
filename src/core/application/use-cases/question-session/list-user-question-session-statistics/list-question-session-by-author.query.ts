import type { Query } from '@/src/core/application/common/interfaces';

import type { QuestionSessionWithTopicAndSubjectDto } from './user-question-session-overview.dto';

export type ListQuestionSessionsByAuthorQuery = Query<
  string,
  QuestionSessionWithTopicAndSubjectDto[]
>;
