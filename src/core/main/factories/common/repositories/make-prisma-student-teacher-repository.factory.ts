import { PrismaStudentTeacherRepository } from '@/src/core/infrastructure/databases/prisma/repositories';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma'

export function makePrismaStudentTeacherRepository() {
  return new PrismaStudentTeacherRepository({ prisma });
}