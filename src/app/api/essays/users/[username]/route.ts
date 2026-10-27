import { nextRouteAdapter } from '@/src/core/main/adapters';
import { EssayFactories } from '@/src/core/main/factories';

const listEssays = EssayFactories.makeListEssays();
export const GET = nextRouteAdapter(listEssays);

const createEssay = EssayFactories.makeCreateEssay();
export const POST = nextRouteAdapter(createEssay);
