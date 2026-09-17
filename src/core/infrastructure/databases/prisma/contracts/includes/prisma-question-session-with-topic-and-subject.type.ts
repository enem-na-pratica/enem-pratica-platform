import { Prisma } from '@/src/generated/prisma/client';

/**
 * Define a estrutura de inclusão para garantir que o
 * tópico e a disciplina venham junto com a sessão.
 */
export const prismaQuestionSessionWithTopicAndSubjectInclude = {
  topic: {
    include: {
      subject: true,
    },
  },
} satisfies Prisma.QuestionSessionInclude;

/**
 * Extrai o tipo resultante da query do Prisma utilizando
 * o helper GetPayload.
 */
export type PrismaQuestionSessionWithTopicAndSubject = Prettify<
  Prisma.QuestionSessionGetPayload<{
    include: typeof prismaQuestionSessionWithTopicAndSubjectInclude;
  }>
>;
