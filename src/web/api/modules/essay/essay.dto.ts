type Grades = {
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
}

export type EssayDto = {
  id: string;
  authorId: string;
  theme: string;
  grades: Grades & { total: number };
  createdAt: string;
};

export type EssayStatistics = {
  totalCount: number;
  globalAverage: number;
  averagesPerCompetency: Grades;
};

export type UserEssaysOverviewDto = {
  statistics: EssayStatistics;
  essays: EssayDto[];
};