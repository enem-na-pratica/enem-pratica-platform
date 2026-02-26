import { nextRouteAdapter } from '@/src/core/main/adapters';
import { EssayFactories } from '@/src/core/main/factories';

const listUserEssaysStatistics = EssayFactories.makeListUserEssaysStatistics();
export const GET = nextRouteAdapter(listUserEssaysStatistics);
