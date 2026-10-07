import type { Prisma, QuestionSession } from '@/src/generated/prisma/client';

export const questionSessionGroupByArgs = {
  by: ['date'],
  _count: { _all: true },
  _sum: { total: true, correct: true },
  orderBy: { date: 'desc' },
} satisfies Prisma.QuestionSessionGroupByArgs;

export type DailyGroupResult = Awaited<
  Prisma.GetQuestionSessionGroupByPayload<typeof questionSessionGroupByArgs>
>;

export type QuestionSessionStatsRawPrisma = {
  dailyGroups: DailyGroupResult;
  unreviewedSessions: QuestionSession[];
};
