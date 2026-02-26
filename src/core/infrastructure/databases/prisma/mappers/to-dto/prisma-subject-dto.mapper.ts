import type { SubjectDto } from '@/src/core/application/common/dtos';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type { Subject as PrismaSubject } from '@/src/generated/prisma/client';

export class PrismaSubjectDtoMapper implements Mapper<
  PrismaSubject,
  SubjectDto
> {
  public map(subject: PrismaSubject): SubjectDto {
    return {
      id: subject.id,
      name: subject.name,
      category: subject.category,
      createdAt: subject.createdAt.toISOString(),
    };
  }
}
