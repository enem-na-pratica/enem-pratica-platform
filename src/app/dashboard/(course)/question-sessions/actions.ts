'use server';

import { revalidatePath } from 'next/cache';

import {
  type CreateQuestionSessionDto,
  type SetIsReviewedDto,
  makeQuestionSessionService,
} from '@/src/web/api';

export async function createQuestionSessionAction({
  data,
  targetUsername = 'me',
}: {
  data: CreateQuestionSessionDto;
  targetUsername?: string;
}): Promise<void> {
  await makeQuestionSessionService().create({
    dataQuestionSession: data,
    username: targetUsername,
  });
  revalidatePath('/dashboard/question-sessions');
}

export async function setIsReviewedAction(
  data: SetIsReviewedDto,
): Promise<void> {
  await makeQuestionSessionService().setIsReviewed(data);
  revalidatePath('/dashboard/question-sessions');
}
