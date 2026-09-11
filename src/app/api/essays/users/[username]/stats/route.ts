import { nextRouteAdapter } from '@/src/core/main/adapters';
import { EssayFactories } from '@/src/core/main/factories';

const getAuthorEssaysStats = EssayFactories.makeGetAuthorEssaysStats();
export const GET = nextRouteAdapter(getAuthorEssaysStats);
