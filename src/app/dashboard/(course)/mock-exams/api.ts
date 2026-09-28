import {
  type MockExam,
  type MockExamStats,
  makeMockExamService,
} from '@/src/web/api';

export async function fetchListMockExamByAuthor(
  username: string = 'me',
): Promise<MockExam[]> {
  return makeMockExamService().listMockExamsByAuthor(username);
}

export async function fetchMockExamStatsByAuthor(
  username: string = 'me',
): Promise<MockExamStats> {
  return makeMockExamService().getMockExamStatsByAuthor(username);
}
