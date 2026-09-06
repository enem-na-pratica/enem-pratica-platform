'use server';

import { revalidatePath } from 'next/cache';

import { makeEssayService } from '@/src/web/api';
import type { CreateEssayFormValues } from '@/src/web/validation';

export async function createEssayAction({
  data,
  targetUsername = 'me',
}: {
  data: CreateEssayFormValues;
  targetUsername?: string;
}): Promise<void> {
  await makeEssayService().create({
    dataEssay: data,
    username: targetUsername,
  });

  revalidatePath('/dashboard/essays');
}
