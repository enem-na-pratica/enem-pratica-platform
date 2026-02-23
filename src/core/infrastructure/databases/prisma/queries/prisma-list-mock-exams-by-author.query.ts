import type { MockExamDto } from '@/src/core/application/common/dtos';
import type { ListMockExamsByAuthorQuery } from '@/src/core/application/use-cases/mock-exam';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type { PrismaMockExamFull } from '@/src/core/infrastructure/databases/prisma/types';
import type { PrismaClient } from '@/src/generated/prisma/client';

type PrismaListMockExamsByAuthorQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaMockExamFull, MockExamDto>;
};

export class PrismaListMockExamsByAuthorQuery implements ListMockExamsByAuthorQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<PrismaMockExamFull, MockExamDto>;

  constructor({ prisma, mapper }: PrismaListMockExamsByAuthorQueryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async execute(authorId: string): Promise<MockExamDto[]> {
    const mockExams = await this.prisma.mockExam.findMany({
      where: {
        authorId: authorId,
      },
      include: {
        performances: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return mockExams.map((mockExam) => this.mapper.map(mockExam));
  }
}
