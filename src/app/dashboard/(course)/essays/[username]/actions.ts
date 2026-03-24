'use server';
import { revalidatePath } from 'next/cache';

import { makeEssayService } from '@/src/web/api';
import { CreateEssayFormValues } from '@/src/web/validation';

export async function createEssayAction({
  data,
  targetUsername,
}: {
  data: CreateEssayFormValues;
  targetUsername: string;
}) {
  await makeEssayService().create({
    dataEssay: data,
    username: targetUsername,
  });

  revalidatePath('/dashboard/essays');
}
