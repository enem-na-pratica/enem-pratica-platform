import { nextRouteAdapter } from '@/src/core/main/adapters';
import { UserFactories } from '@/src/core/main/factories';

const listInstructorStudents = UserFactories.makeListInstructorStudents();
export const GET = nextRouteAdapter(listInstructorStudents);