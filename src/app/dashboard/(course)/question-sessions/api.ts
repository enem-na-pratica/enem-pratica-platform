import {
  type Subject,
  type TopicProgress,
  type UserQuestionSessionsOverview,
  makeQuestionSessionService,
  makeSubjectService,
} from '@/src/web/api';

export async function fetchListSubjects(): Promise<Subject[]> {
  return makeSubjectService().listSubjects();
}

export async function fetchUserQuestionSessionStats(
  username: string = 'me',
): Promise<UserQuestionSessionsOverview> {
  return makeQuestionSessionService().listQuestionSessionsStatisticsForUser(
    username,
  );
}

export async function fetchTopicsBySubject({
  subjectSlug,
  targetUsername = 'me',
}: {
  subjectSlug: string;
  targetUsername?: string;
}): Promise<TopicProgress[]> {
  const listSubjectProgress = await makeSubjectService().listSubjectProgress({
    subjectSlug,
    username: targetUsername,
  });
  return listSubjectProgress;
}
