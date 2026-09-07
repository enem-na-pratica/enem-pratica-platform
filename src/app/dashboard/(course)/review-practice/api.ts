import {
  type Subject,
  type TopicProgress,
  makeSubjectService,
} from '@/src/web/api';
import type { TopicStatus } from '@/src/web/config';

export async function fetchSubjects(): Promise<Subject[]> {
  const listSubjects = await makeSubjectService().listSubjects();
  return listSubjects;
}

export async function fetchTopicsBySubjectAndStatus({
  status,
  subjectSlug,
  targetUsername = 'me',
}: {
  subjectSlug: string;
  status: Exclude<TopicStatus, 'COMPREHENDED'>[];
  targetUsername?: string;
}): Promise<TopicProgress[]> {
  const listSubjectProgress = await makeSubjectService().listSubjectProgress({
    subjectSlug,
    username: targetUsername,
    status,
  });
  return listSubjectProgress;
}
