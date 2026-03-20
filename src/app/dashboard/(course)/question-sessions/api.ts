import { TopicProgress, makeSubjectService } from '@/src/web/api';

export async function fetchTopicsBySubject(
  subjectSlug: string,
): Promise<TopicProgress[]> {
  const listSubjectProgress = await makeSubjectService().listSubjectProgress({
    subjectSlug,
    username: 'me',
  });
  return listSubjectProgress;
}
