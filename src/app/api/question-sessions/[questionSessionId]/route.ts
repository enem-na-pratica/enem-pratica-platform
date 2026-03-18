import { nextRouteAdapter } from '@/src/core/main/adapters';
import { QuestionSessionFactories } from '@/src/core/main/factories';

const setIsReviewed = QuestionSessionFactories.makeSetIsReviewed();
export const PATCH = nextRouteAdapter(setIsReviewed);
