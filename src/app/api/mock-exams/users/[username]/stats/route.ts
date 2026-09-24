import { nextRouteAdapter } from '@/src/core/main/adapters';
import { MockExamFactories } from '@/src/core/main/factories';

const getAuthorMockExamStats = MockExamFactories.makeGetAuthorMockExamStats();
export const GET = nextRouteAdapter(getAuthorMockExamStats);
