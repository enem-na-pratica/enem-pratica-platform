import { Prisma } from '@/src/generated/prisma/client';

/**
 * Define a estrutura de inclusão para garantir que o
 * progresso do usuário venha junto com o tópico.
 */
export const prismaTopicWithProgressInclude = {
  userTopicProgresses: true,
} satisfies Prisma.TopicInclude;

/**
 * Extrai o tipo resultante da query do Prisma utilizando
 * o helper GetPayload.
 */
export type PrismaTopicWithProgress = Prettify<
  Prisma.TopicGetPayload<{
    include: typeof prismaTopicWithProgressInclude;
  }>
>;
 