import {
  type Subject,
  makeSubjectService,
} from '@/src/web/api';
import '@/src/web/api';

export async function fetchSubjects(): Promise<Subject[]> {
  const listSubjects = await makeSubjectService().listSubjects();
  return listSubjects;
}

