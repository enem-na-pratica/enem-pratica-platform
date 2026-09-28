import { Prisma } from '@/src/generated/prisma/client';

// Define o que o "Include" deve conter
export const prismaMockExamFullInclude = {
  performances: true,
} satisfies Prisma.MockExamInclude;

// Extrai o tipo baseado no include acima
export type PrismaMockExamFull = Prettify<
  Prisma.MockExamGetPayload<{
    include: typeof prismaMockExamFullInclude;
  }>
>;
