import type { SubjectDto } from '@/src/core/application/common/dtos';
import type { ListSubjectsQuery } from '@/src/core/application/use-cases/subject';
import type { Mapper } from '@/src/core/domain/contracts';
import type {
  PrismaClient,
  Subject as PrismaSubject,
} from '@/src/generated/prisma/client';

type PrismaListSubjectsQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaSubject, SubjectDto>;
};

export class PrismaListSubjectsQuery implements ListSubjectsQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<PrismaSubject, SubjectDto>;

  constructor({ prisma, mapper }: PrismaListSubjectsQueryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async execute(): Promise<SubjectDto[]> {
    const prismaSubjects = await this.prisma.subject.findMany();
    return prismaSubjects.map((prismaSubject) =>
      this.mapper.map(prismaSubject),
    );
  }
}
