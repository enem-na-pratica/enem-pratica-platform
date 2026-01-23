import type { EssayRepository } from '@/src/core/domain/contracts/repositories';
import type { Essay } from '@/src/core/domain/entities';
import type {
  PrismaClient,
  Essay as PrismaEssay
} from "@/src/generated/prisma/client";
import type { Mapper } from "@/src/core/domain/contracts/mappers";

type PrismaEssayRepositoryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaEssay, Essay>;
};

export class PrismaEssayRepository implements EssayRepository {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<PrismaEssay, Essay>;

  constructor({ prisma, mapper }: PrismaEssayRepositoryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async create(essay: Essay): Promise<Essay> {
    const newEssay = await this.prisma.essay.create({
      data: {
        theme: essay.theme,
        competency1: essay.competency1,
        competency2: essay.competency2,
        competency3: essay.competency3,
        competency4: essay.competency4,
        competency5: essay.competency5,
        author: {
          connect: { id: essay.authorId }
        }
      }
    });

    return this.mapper.map(newEssay);
  }
}