import { useForm, useWatch } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  type CreateQuestionSessionFormValues,
  createQuestionSessionSchema,
} from '@/src/web/validation';

const PERCENTAGE_MULTIPLIER = 100;

export function useQuestionSessionForm() {
  const today = getTodayDate();

  const defaultValues: CreateQuestionSessionFormValues = {
    topicId: '',
    date: today,
    total: 10,
    correct: 0,
    isReviewed: false,
  };

  const form = useForm<CreateQuestionSessionFormValues>({
    resolver: zodResolver(createQuestionSessionSchema),
    mode: 'onChange',
    defaultValues,
  });

  const { control, reset } = form;

  const total = useWatch({ control, name: 'total' }) ?? 0;
  const correct = useWatch({ control, name: 'correct' }) ?? 0;
  const incorrect = Math.max(0, Number(total) - Number(correct));
  const performance =
    Number(total) > 0
      ? (Number(correct) / Number(total)) * PERCENTAGE_MULTIPLIER
      : 0;

  const resetForm = () => reset(defaultValues);

  return { ...form, total, correct, incorrect, performance, today, resetForm };
}

function getTodayDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}
