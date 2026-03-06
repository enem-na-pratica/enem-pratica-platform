import {
  type Subject,
  type TopicProgress,
  makeSubjectService,
} from '@/src/web/api';
import '@/src/web/api';

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
