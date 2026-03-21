import { nextRouteAdapter } from '@/src/core/main/adapters';
import { EssayFactories } from '@/src/core/main/factories';

const createEssay = EssayFactories.makeCreateEssay();
export const POST = nextRouteAdapter(createEssay);

const listUserEssaysStatistics = EssayFactories.makeListUserEssaysStatistics();
export const GET = nextRouteAdapter(listUserEssaysStatistics);
