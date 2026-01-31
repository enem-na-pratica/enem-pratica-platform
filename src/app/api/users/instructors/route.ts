import { nextRouteAdapter } from '@/src/core/main/adapters';
import { UserFactories } from '@/src/core/main/factories';

const listInstructors = UserFactories.makeListAvailableInstructors();
export const GET = nextRouteAdapter(listInstructors);