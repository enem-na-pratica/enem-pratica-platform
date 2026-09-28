import {
  type MockExamStats,
  type UserMockExamsOverview,
  makeMockExamService,
} from '@/src/web/api';

export async function fetchUserMockExamsStats(
  username: string = 'me',
): Promise<UserMockExamsOverview> {
  return makeMockExamService().listMockExamsStatisticsForUser(username);
}

export async function fetchAuthorMockExamsStats(
  username: string = 'me',
): Promise<MockExamStats> {
  return makeMockExamService().getAuthorMockExamsStats(username);
}
