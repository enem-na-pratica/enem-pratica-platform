import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type { MockExamRepository } from '@/src/core/domain/contracts/repositories';
import type { MockExam } from '@/src/core/domain/entities';
import type { PrismaMockExamFull } from '@/src/core/infrastructure/databases/prisma/types';
import type { PrismaClient } from '@/src/generated/prisma/client';

type PrismaMockExamRepositoryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaMockExamFull, MockExam>;
};

export class PrismaMockExamRepository implements MockExamRepository {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<PrismaMockExamFull, MockExam>;

  constructor({ prisma, mapper }: PrismaMockExamRepositoryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async create(mockExam: MockExam): Promise<MockExam> {
    const performancesData = Object.values(mockExam.performances).map(
      (perf) => {
        return {
          area: perf.area,
          correctCount: perf.overallResult.correctAnswers,
          certaintyCount: perf.qualityAssessment.certaintyHits,
          doubtErrors: perf.qualityAssessment.doubtErrors,
          distractionErrors: perf.errorAnalysis.distractionErrors,
          interpretationErrors: perf.errorAnalysis.interpretationErrors,
        };
      },
    );

    const newMockExam = await this.prisma.mockExam.create({
      data: {
        title: mockExam.title,
        authorId: mockExam.authorId,
        performances: {
          createMany: {
            data: performancesData,
          },
        },
      },
      include: {
        performances: true,
      },
    });

    return this.mapper.map(newMockExam);
  }
}
