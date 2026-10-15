import { nextRouteAdapter } from '@/src/core/main/adapters';
import { MockExamFactories } from '@/src/core/main/factories';

const listMockExamsByAuthor = MockExamFactories.makeListMockExamsByAuthor();
export const GET = nextRouteAdapter(listMockExamsByAuthor);

const createMockExam = MockExamFactories.makeCreateMockExam();
export const POST = nextRouteAdapter(createMockExam);
