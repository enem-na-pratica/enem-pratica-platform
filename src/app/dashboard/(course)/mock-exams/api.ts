import { type UserMockExamsOverview, makeMockExamService } from '@/src/web/api';

export async function fetchUserMockExamsStats(
  username: string = 'me',
): Promise<UserMockExamsOverview> {
  return makeMockExamService().listMockExamsStatisticsForUser(username);
}
