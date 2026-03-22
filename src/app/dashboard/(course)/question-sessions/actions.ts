'use server';

import { revalidatePath } from 'next/cache';

import { SetIsReviewedDto } from '@/src/core/application/use-cases/question-session/set-is-reviewed/set-is-reviewed.dto';
import { makeQuestionSessionService } from '@/src/web/api';
import { CreateQuestionSessionFormValues } from '@/src/web/validation';

export async function createQuestionSessionAction(
  data: CreateQuestionSessionFormValues,
) {
  await makeQuestionSessionService().create({
    dataQuestionSession: data,
    username: 'me',
  });
  revalidatePath('/dashboard/question-sessions');
}

export async function setIsReviewedAction(data: SetIsReviewedDto) {
  await makeQuestionSessionService().setIsReviewed(data);
  revalidatePath('/dashboard/question-sessions');
}
