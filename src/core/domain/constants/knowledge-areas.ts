export const knowledgeArea = {
  LANGUAGES: 'LANGUAGES',
  HUMANITIES: 'HUMANITIES',
  NATURAL_SCIENCES: 'NATURAL_SCIENCES',
  MATHEMATICS: 'MATHEMATICS',
} as const;

export type KnowledgeArea = typeof knowledgeArea[keyof typeof knowledgeArea];