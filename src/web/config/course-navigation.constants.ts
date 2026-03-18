export const COURSE_NAVIGATION_ITEMS = [
  {
    key: 'study-tracker',
    label: 'Acompanhamento de Estudos',
    icon: '📚',
    description: 'Material de estudo',
  },
  {
    key: 'review-practice',
    label: 'Revisar & Praticar',
    icon: '⏳',
    description: 'Tópicos pendentes',
  },
  {
    key: 'question-sessions',
    label: 'Revisão',
    icon: '🔄',
    description: 'Praticar o que aprendeu',
  },
  {
    key: 'mock-exams',
    label: 'Simulados',
    icon: '📝',
    description: 'Treine com o tempo',
  },
  {
    key: 'essays',
    label: 'Redações',
    icon: '✍️',
    description: 'Pratique sua escrita',
  },
] as const;

export type CourseNavigationItem = (typeof COURSE_NAVIGATION_ITEMS)[number];
export type CourseNavigationKey = CourseNavigationItem['key'];
