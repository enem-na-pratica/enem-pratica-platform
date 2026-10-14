import type { Query } from '@/src/core/application/common/interfaces';

import type { QuestionSessionExtendedDto } from './question-session-extended.dto';

export type ListQuestionSessionsByAuthorQuery = Query<
  string,
  QuestionSessionExtendedDto[]
>;
