import type { Prisma } from '@/src/generated/prisma/client';

export const essayAggregateArgs = {
  _count: true,
  _avg: {
    competency1: true,
    competency2: true,
    competency3: true,
    competency4: true,
    competency5: true,
  },
} satisfies Prisma.EssayAggregateArgs;

export type EssayAggregateResult = Prisma.GetEssayAggregateType<
  typeof essayAggregateArgs
>;
