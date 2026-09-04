import { useForm, useWatch } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  type CreateMockExamFormValues,
  createMockExamSchema,
} from '@/src/web/validation';

import {
  type AreaCalculatedValues,
  type AreaInputValues,
  calculateAreasStats,
} from '../_utils';
import {
  AREAS,
  DEFAULT_FORM_VALUES,
  TOTAL_QUESTIONS_PER_AREA,
} from '../constants';

const PERCENTAGE_MULTIPLIER = 100;
const AREAS_COUNT = AREAS.length;

export function useMockExamForm() {
  const form = useForm<CreateMockExamFormValues>({
    mode: 'onChange',
    resolver: zodResolver(createMockExamSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { control, reset } = form;

  const watchedAreas = useWatch({ control, name: 'performances' });

  const calculatedData = calculateAreasStats(
    AREAS,
    watchedAreas,
    TOTAL_QUESTIONS_PER_AREA,
  );

  const calculateTotalInput = (field: keyof AreaInputValues) =>
    AREAS.reduce((sum, { key }) => sum + (watchedAreas[key]?.[field] || 0), 0);

  const calculateTotalCalculated = (field: keyof AreaCalculatedValues) =>
    AREAS.reduce(
      (sum, { key }) => sum + (calculatedData[key]?.[field] || 0),
      0,
    );

  const totalCorrect = calculateTotalInput('correctCount');
  const globalPerformance =
    (totalCorrect / (TOTAL_QUESTIONS_PER_AREA * AREAS_COUNT)) *
    PERCENTAGE_MULTIPLIER;

  const resetForm = () => reset(DEFAULT_FORM_VALUES);

  return {
    ...form,
    calculatedData,
    calculateTotalInput,
    calculateTotalCalculated,
    totalCorrect,
    globalPerformance,
    resetForm,
  };
}
