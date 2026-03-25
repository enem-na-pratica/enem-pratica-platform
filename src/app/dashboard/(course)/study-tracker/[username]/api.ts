import {
  type Subject,
  type TopicProgress,
  UserTopicProgress,
  makeSubjectService,
  makeUserTopicProgressService,
} from '@/src/web/api';
import type { TopicStatus } from '@/src/web/config';

export async function fetchSubjects(): Promise<Subject[]> {
  const listSubjects = await makeSubjectService().listSubjects();
  return listSubjects;
}

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

export async function updateTopicStatus({
  status,
  targetUsername,
  topicId,
}: {
  topicId: string;
  status: TopicStatus;
  targetUsername: string;
}): Promise<UserTopicProgress> {
  return await makeUserTopicProgressService().SetTopicStatus({
    status,
    topicId,
    username: targetUsername,
  });
}
