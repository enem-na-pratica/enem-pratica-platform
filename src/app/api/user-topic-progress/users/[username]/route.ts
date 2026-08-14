import { nextRouteAdapter } from '@/src/core/main/adapters';
import { UserTopicProgressFactories } from '@/src/core/main/factories';

const createUserTopicProgress = UserTopicProgressFactories.makeSetTopicStatus();
// TODO: Change endpoint method from POST to PATCH.
// Reason: The field already exists (defaults to null) and is just being updated, not created.
export const POST = nextRouteAdapter(createUserTopicProgress);
