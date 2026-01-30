import { nextRouteAdapter } from '@/src/core/main/adapters';
import { EssayFactories } from '@/src/core/main/factories';

const listUserEssaysSummary = EssayFactories.makeListUserEssaysSummary();
export const GET = nextRouteAdapter(listUserEssaysSummary);