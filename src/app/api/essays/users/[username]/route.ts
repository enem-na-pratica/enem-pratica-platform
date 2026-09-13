import { nextRouteAdapter } from '@/src/core/main/adapters';
import { EssayFactories } from '@/src/core/main/factories';

const listAuthorEssays = EssayFactories.makeListAuthorEssays();
export const GET = nextRouteAdapter(listAuthorEssays);

const createEssay = EssayFactories.makeCreateEssay();
export const POST = nextRouteAdapter(createEssay);
