import { EssayDto } from '@/src/core/application/common/dtos';
import { EssayPaginatedSlice } from '@/src/core/application/use-cases/essay';
import { Mapper } from '@/src/core/domain/contracts/mappers/mapper.interface';
import type { Essay as PrismaEssay } from '@/src/generated/prisma/client';

export class PrismaEssayPaginatedSliceMapper implements Mapper<
  { items: PrismaEssay[]; totalItems: number },
  EssayPaginatedSlice
> {
  constructor(private readonly essayDtoMapper: Mapper<PrismaEssay, EssayDto>) {}

  map(input: {
    items: PrismaEssay[];
    totalItems: number;
  }): EssayPaginatedSlice {
    return {
      totalItems: input.totalItems,
      items: input.items.map((essay) => this.essayDtoMapper.map(essay)),
    };
  }
}
