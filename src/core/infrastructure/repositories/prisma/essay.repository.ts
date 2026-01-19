import { EssayRepository } from "@/src/core/domain/essay/essay.repository.interface";
import { Essay } from "@/src/core/domain/essay/essay.entity";
import { PrismaClient, Essay as EssayPrisma } from "@/src/generated/prisma/client";
import { ToDomainMapper } from "@/src/core/domain/mapper";

export type PrismaEssayRepositoryDeps = {
  prisma: PrismaClient;
  mapper: ToDomainMapper<EssayPrisma, Essay>;
}

export class PrismaEssayRepository implements EssayRepository {
  private readonly prisma: PrismaClient;
  private readonly mapper: ToDomainMapper<EssayPrisma, Essay>;

  constructor(deps: PrismaEssayRepositoryDeps) {
    this.prisma = deps.prisma;
    this.mapper = deps.mapper;
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

    return this.mapper.toDomain(newEssay);
  }

  async findAllByAuthor(authorId: string): Promise<Essay[]> {
    const essays = await this.prisma.essay.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' }
    });

    return essays.map(essay => this.mapper.toDomain(essay));
  }
}