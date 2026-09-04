'use server';
import { revalidatePath } from 'next/cache';

import { makeMockExamService } from '@/src/web/api';
import type { CreateMockExamFormValues } from '@/src/web/validation';

export async function createMockExamAction({
  data,
  targetUsername = 'me',
}: {
  data: CreateMockExamFormValues;
  targetUsername?: string;
}) {
  await makeMockExamService().create({
    dataMockExam: data,
    username: targetUsername,
  });

  revalidatePath('/dashboard/mock-exams');
}
