import { nextRouteAdapter } from '@/src/core/main/adapters';
import { UserTopicProgressFactories } from '@/src/core/main/factories';

const createUserTopicProgress = UserTopicProgressFactories.makeSetTopicStatus();
export const POST = nextRouteAdapter(createUserTopicProgress);
