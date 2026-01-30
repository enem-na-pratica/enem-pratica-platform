import { nextRouteAdapter } from '@/src/core/main/adapters';
import { UserFactories } from '@/src/core/main/factories';

const authenticatedUser = UserFactories.makeGetAuthenticatedUser();
export const GET = nextRouteAdapter(authenticatedUser);