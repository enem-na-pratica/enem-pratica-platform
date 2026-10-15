import type { Query } from '@/src/core/application/common/interfaces';

import type { QuestionSessionStatsRaw } from './question-session-stats.dto';

export type GetQuestionSessionRawAggregateQuery = Query<
  string,
  QuestionSessionStatsRaw
>;
