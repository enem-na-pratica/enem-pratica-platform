import { nextRouteAdapter } from '@/src/core/main/adapters';
import { QuestionSessionFactories } from '@/src/core/main/factories';

const getQuestionSessionStatsByAuthor =
  QuestionSessionFactories.makeGetQuestionSessionStatsByAuthor();
export const GET = nextRouteAdapter(getQuestionSessionStatsByAuthor);
