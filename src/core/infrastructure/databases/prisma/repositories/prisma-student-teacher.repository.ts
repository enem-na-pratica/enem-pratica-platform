import type { StudentTeacherRepository } from '@/src/core/domain/contracts/repositories';
import type { PrismaClient } from "@/src/generated/prisma/client";

type PrismaStudentTeacherRepositoryDeps = {
  prisma: PrismaClient;
};

export class PrismaStudentTeacherRepository implements StudentTeacherRepository {
  private readonly prisma: PrismaClient;

  constructor({ prisma }: PrismaStudentTeacherRepositoryDeps) {
    this.prisma = prisma;
  }

  isStudentAssignedToTeacher(
    {
      studentId,
      teacherId
    }: {
      studentId: string;
      teacherId: string;
    }
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}