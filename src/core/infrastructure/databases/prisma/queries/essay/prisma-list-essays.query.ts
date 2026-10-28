import type {
  EssayPaginatedSlice,
  EssayPaginationParams,
  ListEssaysQuery,
} from '@/src/core/application/use-cases/essay/list-essays';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type {
  Prisma,
  PrismaClient,
  Essay as PrismaEssay,
} from '@/src/generated/prisma/client';

type PrismaListEssaysQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<
    { items: PrismaEssay[]; totalItems: number },
    EssayPaginatedSlice
  >;
};

export class PrismaListEssaysQuery implements ListEssaysQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<
    { items: PrismaEssay[]; totalItems: number },
    EssayPaginatedSlice
  >;

  constructor({ prisma, mapper }: PrismaListEssaysQueryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async execute(input: EssayPaginationParams): Promise<EssayPaginatedSlice> {
    const { page, limit, sortBy, sortOrder, filters } = input;

    const where = this.buildWhere(filters);
    const orderBy = this.buildOrderBy(sortBy, sortOrder);

    const [essays, totalItems] = await this.prisma.$transaction([
      this.prisma.essay.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.essay.count({ where }),
    ]);

    return this.mapper.map({ items: essays, totalItems });
  }

  private buildWhere(
    filters: EssayPaginationParams['filters'],
  ): Prisma.EssayWhereInput {
    const { authorId, theme, startDate, endDate } = filters;

    return {
      authorId,
      ...(theme && {
        theme: { contains: theme, mode: 'insensitive' },
      }),
      ...((startDate || endDate) && {
        createdAt: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      }),
    };
  }

  private buildOrderBy(
    sortBy: EssayPaginationParams['sortBy'],
    sortOrder: EssayPaginationParams['sortOrder'],
  ): Prisma.EssayOrderByWithRelationInput[] {
    const primary: Prisma.EssayOrderByWithRelationInput =
      sortBy === 'theme' ? { theme: sortOrder } : { createdAt: sortOrder };

    return [primary, { id: 'asc' }];
  }
}
