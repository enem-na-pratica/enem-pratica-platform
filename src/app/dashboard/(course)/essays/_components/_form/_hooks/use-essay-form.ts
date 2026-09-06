import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  type CreateEssayFormValues,
  createEssaySchema,
} from '@/src/web/validation';

const DEFAULT_GRADE = 120;

const defaultValues: CreateEssayFormValues = {
  theme: '',
  grades: {
    c1: DEFAULT_GRADE,
    c2: DEFAULT_GRADE,
    c3: DEFAULT_GRADE,
    c4: DEFAULT_GRADE,
    c5: DEFAULT_GRADE,
  },
};

export function useEssayForm() {
  const form = useForm<CreateEssayFormValues>({
    resolver: zodResolver(createEssaySchema),
    mode: 'onChange',
    defaultValues,
  });

  const resetForm = () => form.reset(defaultValues);

  return { ...form, resetForm };
}
