import { nextRouteAdapter } from '@/src/core/main/adapters';
import { SubjectFactories } from '@/src/core/main/factories';

const listSubjects = SubjectFactories.makeListSubjects();
export const GET = nextRouteAdapter(listSubjects);
