export const KNOWLEDGE_AREA = {
  LANGUAGES: 'LANGUAGES',
  HUMANITIES: 'HUMANITIES',
  NATURAL_SCIENCES: 'NATURAL_SCIENCES',
  MATHEMATICS: 'MATHEMATICS',
} as const;

export type KnowledgeArea =
  (typeof KNOWLEDGE_AREA)[keyof typeof KNOWLEDGE_AREA];

export const KNOWLEDGE_AREA_LABELS: Record<KnowledgeArea, string> = {
  [KNOWLEDGE_AREA.HUMANITIES]: 'Humanas',
  [KNOWLEDGE_AREA.LANGUAGES]: 'Linguagens',
  [KNOWLEDGE_AREA.NATURAL_SCIENCES]: 'Natureza',
  [KNOWLEDGE_AREA.MATHEMATICS]: 'Matemática',
};
