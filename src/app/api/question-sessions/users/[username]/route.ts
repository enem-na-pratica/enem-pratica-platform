import { nextRouteAdapter } from '@/src/core/main/adapters';
import { QuestionSessionFactories } from '@/src/core/main/factories';

const listQuestionSessionsByAuthor =
  QuestionSessionFactories.makeListQuestionSessionsByAuthor();
export const GET = nextRouteAdapter(listQuestionSessionsByAuthor);

const createQuestionSession =
  QuestionSessionFactories.makeCreateQuestionSession();
export const POST = nextRouteAdapter(createQuestionSession);
