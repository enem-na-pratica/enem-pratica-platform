import { FindAllByAuthor } from "@/src/core/application/interfaces/essay/find-all-by-author-use-case.interface";
import { Essay } from "@/src/core/domain/entities/essay.entity";
import { EssayResDto, EssaysResponse } from "@/src/core/application/dtos/essay";
import { EssayRepository } from "@/src/core/domain/contracts/repositories/essay-repository.interface";
import { ToDtoMapper } from "@/src/core/domain/mapper";

export type FindAllByAuthorUseCaseDeps = {
  essayRepository: EssayRepository;
  mapper: ToDtoMapper<Essay, EssayResDto>;
}

export class FindAllByAuthorUseCase implements FindAllByAuthor {
  private readonly essayRepository: EssayRepository;
  private readonly mapper: ToDtoMapper<Essay, EssayResDto>;

  constructor(deps: FindAllByAuthorUseCaseDeps) {
    this.essayRepository = deps.essayRepository;
    this.mapper = deps.mapper;
  }

  async execute(authorId: string): Promise<EssaysResponse> {
    const essays = await this.essayRepository.findAllByAuthor(authorId);

    const essaysDto = essays.map(essay => this.mapper.toDto(essay));

    const totalCount = essays.length;

    if (totalCount === 0) {
      return {
        summary: {
          totalCount: 0,
          globalAverage: 0,
          averagesPerCompetency: { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 },
        },
        data: [],
      };
    }

    const totals = essaysDto.reduce((acc, curr) => ({
      total: acc.total + curr.grades.total,
      c1: acc.c1 + curr.grades.c1,
      c2: acc.c2 + curr.grades.c2,
      c3: acc.c3 + curr.grades.c3,
      c4: acc.c4 + curr.grades.c4,
      c5: acc.c5 + curr.grades.c5,
    }), { total: 0, c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 });

    return {
      summary: {
        totalCount,
        globalAverage: totals.total / totalCount,
        averagesPerCompetency: {
          c1: totals.c1 / totalCount,
          c2: totals.c2 / totalCount,
          c3: totals.c3 / totalCount,
          c4: totals.c4 / totalCount,
          c5: totals.c5 / totalCount,
        },
      },
      data: essaysDto,
    };
  }
}