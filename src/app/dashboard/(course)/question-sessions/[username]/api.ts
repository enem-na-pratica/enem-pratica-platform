import { TopicProgress, makeSubjectService } from '@/src/web/api';

export async function fetchTopicsBySubject({
  subjectSlug,
  targetUsername,
}: {
  subjectSlug: string;
  targetUsername: string;
}): Promise<TopicProgress[]> {
  const listSubjectProgress = await makeSubjectService().listSubjectProgress({
    subjectSlug,
    username: targetUsername,
  });
  return listSubjectProgress;
}
