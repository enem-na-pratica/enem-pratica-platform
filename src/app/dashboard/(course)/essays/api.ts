import { type Essay, type EssayStats, makeEssayService } from '@/src/web/api';

export async function fetchListAuthorEssays(
  username: string = 'me',
): Promise<Essay[]> {
  return makeEssayService().listAuthorEssays(username);
}

export async function fetchAuthorEssaysStats(
  username: string = 'me',
): Promise<EssayStats> {
  return makeEssayService().getAuthorEssaysStats(username);
}
