import {
  type Subject,
  type TopicProgress,
  makeSubjectService,
  makeUserTopicProgressService,
} from '@/src/web/api';
import '@/src/web/api';
import type { TopicStatus } from '@/src/web/config';

export async function fetchSubjects(): Promise<Subject[]> {
  const listSubjects = await makeSubjectService().listSubjects();
  return listSubjects;
}

export async function fetchTopicsBySubject(
  subjectSlug: string,
): Promise<TopicProgress[]> {
  const listSubjectProgress = await makeSubjectService().listSubjectProgress({
    subjectSlug,
    username: 'me',
  });
  return listSubjectProgress;
}

export async function updateTopicStatus(
  topicId: string,
  status: TopicStatus,
): Promise<void> {
  await makeUserTopicProgressService().SetTopicStatus({
    status,
    topicId,
  });
}
