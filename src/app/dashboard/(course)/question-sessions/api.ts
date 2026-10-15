import {
  type QuestionSessionExtended,
  type QuestionSessionStats,
  type Subject,
  type TopicProgress,
  makeQuestionSessionService,
  makeSubjectService,
} from '@/src/web/api';

export async function fetchListSubjects(): Promise<Subject[]> {
  return makeSubjectService().listSubjects();
}

export async function fetchListQuestionSessionsByAuthor(
  username: string = 'me',
): Promise<QuestionSessionExtended[]> {
  return makeQuestionSessionService().listQuestionSessionsByAuthor(username);
}

export async function fetchQuestionSessionStatsByAuthor(
  username: string = 'me',
): Promise<QuestionSessionStats> {
  return makeQuestionSessionService().getQuestionSessionStatsByAuthor(username);
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
