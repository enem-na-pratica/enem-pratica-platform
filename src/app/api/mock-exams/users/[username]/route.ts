import { nextRouteAdapter } from '@/src/core/main/adapters';
import { MockExamFactories } from '@/src/core/main/factories';

const listUserMockExamsStatistics =
  MockExamFactories.makeListUserMockExamsStatistics();
export const GET = nextRouteAdapter(listUserMockExamsStatistics);

const createMockExam = MockExamFactories.makeCreateMockExam();
export const POST = nextRouteAdapter(createMockExam);
