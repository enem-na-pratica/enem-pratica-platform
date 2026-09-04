import type { KnowledgeAreaLabelKey } from '@/src/web/api';
import type { KnowledgeAreaLabelPT } from '@/src/web/config';
import type { CreateMockExamFormValues } from '@/src/web/validation';

export const TOTAL_QUESTIONS_PER_AREA = 45;

export const AREAS: {
  key: KnowledgeAreaLabelKey;
  label: KnowledgeAreaLabelPT;
}[] = [
  { key: 'languages', label: 'Linguagens' },
  { key: 'humanities', label: 'Humanas' },
  { key: 'naturalSciences', label: 'Natureza' },
  { key: 'mathematics', label: 'Matemática' },
];

const EMPTY_AREA_VALUES = {
  correctCount: 0,
  certaintyCount: 0,
  doubtErrors: 0,
  distractionErrors: 0,
  interpretationErrors: 0,
};

export const DEFAULT_FORM_VALUES: CreateMockExamFormValues = {
  title: '',
  performances: {
    languages: { ...EMPTY_AREA_VALUES },
    humanities: { ...EMPTY_AREA_VALUES },
    naturalSciences: { ...EMPTY_AREA_VALUES },
    mathematics: { ...EMPTY_AREA_VALUES },
  },
};
