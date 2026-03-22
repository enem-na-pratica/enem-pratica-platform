import { nextRouteAdapter } from '@/src/core/main/adapters';
import { QuestionSessionFactories } from '@/src/core/main/factories';

const createQuestionSession =
  QuestionSessionFactories.makeCreateQuestionSession();
export const POST = nextRouteAdapter(createQuestionSession);

const listUserQuestionSessionsStatistics =
  QuestionSessionFactories.makeListUserQuestionSessionsStatistics();
export const GET = nextRouteAdapter(listUserQuestionSessionsStatistics);
