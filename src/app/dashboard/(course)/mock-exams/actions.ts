'use server';
import { revalidatePath } from 'next/cache';

import { makeMockExamService } from '@/src/web/api';
import { CreateMockExamFormValues } from '@/src/web/validation';

export async function createMockExamAction(data: CreateMockExamFormValues) {
  await makeMockExamService().createOwn(data);

  revalidatePath('/dashboard/mock-exams');
}
