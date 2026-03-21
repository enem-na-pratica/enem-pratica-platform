'use server';
import { revalidatePath } from 'next/cache';

import { makeEssayService } from '@/src/web/api';
import { CreateEssayFormValues } from '@/src/web/validation';

export async function createEssayAction(data: CreateEssayFormValues) {
  await makeEssayService().createOwn(data);

  revalidatePath('/dashboard/essays');
}
