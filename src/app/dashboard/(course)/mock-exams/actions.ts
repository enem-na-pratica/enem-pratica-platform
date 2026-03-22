'use server';
import { revalidatePath } from 'next/cache';

import { makeMockExamService } from '@/src/web/api';
import { CreateMockExamFormValues } from '@/src/web/validation';

export async function createMockExamAction(data: CreateMockExamFormValues) {
  await makeMockExamService().create({ dataMockExam: data, username: 'me' });

  revalidatePath('/dashboard/mock-exams');
}
