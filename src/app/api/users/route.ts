import { nextRouteAdapter } from '@/src/core/main/adapters';
import { UserFactories } from '@/src/core/main/factories';

const listUsers = UserFactories.makeListUsers();
export const GET = nextRouteAdapter(listUsers);

const createUser = UserFactories.makeCreateUser();
export const POST = nextRouteAdapter(createUser);
