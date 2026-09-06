import { type UserEssaysOverview, makeEssayService } from '@/src/web/api';

export async function fetchUserEssaysStats(
  username: string = 'me',
): Promise<UserEssaysOverview> {
  return makeEssayService().listEssaysStatisticsForUser(username);
}
