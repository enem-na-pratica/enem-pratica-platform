import {
  type EssayStats,
  type UserEssaysOverview,
  makeEssayService,
} from '@/src/web/api';

export async function fetchUserEssaysList(
  username: string = 'me',
): Promise<UserEssaysOverview> {
  return makeEssayService().listEssaysStatisticsForUser(username);
}

export async function fetchUserEssaysStats(
  username: string = 'me',
): Promise<EssayStats> {
  return makeEssayService().getEssaysByAuthor(username);
}
