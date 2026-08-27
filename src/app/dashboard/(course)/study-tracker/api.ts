import {
  type Subject,
  type TopicProgress,
  makeSubjectService,
  makeUserTopicProgressService,
} from '@/src/web/api';
import type { TopicStatus } from '@/src/web/config';

export async function fetchSubjects(): Promise<Subject[]> {
  const listSubjects = await makeSubjectService().listSubjects();
  return listSubjects;
}

type FetchTopicsParams = {
  subjectSlug: string;
  targetUsername?: string;
};

export async function fetchTopicsBySubject({
  subjectSlug,
  targetUsername = 'me',
}: FetchTopicsParams): Promise<TopicProgress[]> {
  const listSubjectProgress = await makeSubjectService().listSubjectProgress({
    subjectSlug,
    username: targetUsername,
  });
  return listSubjectProgress;
}

type UpdateTopicStatusParams = {
  topicId: string;
  status: TopicStatus;
  targetUsername?: string;
};

export async function updateTopicStatus({
  topicId,
  status,
  targetUsername = 'me',
}: UpdateTopicStatusParams): Promise<void> {
  await makeUserTopicProgressService().SetTopicStatus({
    status,
    topicId,
    username: targetUsername,
  });
}
