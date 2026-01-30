import { nextRouteAdapter } from '@/src/core/main/adapters';
import { AuthFactories } from '@/src/core/main/factories';

const logout = AuthFactories.makeLogout();
export const DELETE = nextRouteAdapter(logout);