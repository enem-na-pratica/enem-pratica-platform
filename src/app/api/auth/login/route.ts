import { nextRouteAdapter } from '@/src/core/main/adapters';
import { AuthFactories } from '@/src/core/main/factories';

const login = AuthFactories.makeLogin();
export const POST = nextRouteAdapter(login);