import { nextRouteAdapter } from '@/src/core/main/adapters';
import { QuestionSessionFactories } from '@/src/core/main/factories';

const listUserQuestionSessionsStatistics =
  QuestionSessionFactories.makeListUserQuestionSessionsStatistics();
export const GET = nextRouteAdapter(listUserQuestionSessionsStatistics);

const createQuestionSession =
  QuestionSessionFactories.makeCreateQuestionSession();
export const POST = nextRouteAdapter(createQuestionSession);
