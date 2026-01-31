export type CompetencyIndex = 1 | 2 | 3 | 4 | 5;

export type CompetencyKey = `c${CompetencyIndex}`;

export type Competencies = Record<CompetencyKey, number>;

export type Essay = {
  id: string;
  authorId: string;
  theme: string;
  grades: Competencies & { total: number };
  createdAt: Date;
}

export type EssayStatistics = {
  totalCount: number;
  globalAverage: number;
  averagesPerCompetency: Competencies;
}

export type UserEssaysOverview = {
  statistics: EssayStatistics;
  essays: Essay[];
}