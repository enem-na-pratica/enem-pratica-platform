import { nextRouteAdapter } from '@/src/core/main/adapters';
import { SubjectFactories } from '@/src/core/main/factories';

const listSubjectProgress = SubjectFactories.makeListSubjectProgress();
export const GET = nextRouteAdapter(listSubjectProgress);
