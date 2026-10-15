import type { Query } from '@/src/core/application/common/interfaces';

import type { MockExamsRawAggregate } from './mock-exam-stats.dto';

export type GetMockExamsRawAggregateQuery = Query<
  string,
  MockExamsRawAggregate
>;
