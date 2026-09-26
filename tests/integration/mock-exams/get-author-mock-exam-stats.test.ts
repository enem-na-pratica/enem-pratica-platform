import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { MockExamStatsDto } from '@/src/core/application/use-cases/mock-exam';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeGetAuthorMockExamStats } from '@/src/core/main/factories/mock-exam/make-get-author-mock-exam-stats.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

type AreaPerformanceInput = {
  correctCount: number;
  certaintyCount: number;
  doubtErrors: number;
  distractionErrors: number;
  interpretationErrors: number;
};

type AreaKey = 'LANGUAGES' | 'HUMANITIES' | 'NATURAL_SCIENCES' | 'MATHEMATICS';

type TestUser = { id: string; username: string; role: Role };

const TEST_STUDENT_USERNAME = 'aluno.statsmockexam.teste';
const TEST_STUDENT2_USERNAME = 'aluno2.statsmockexam.teste';
const TEST_TEACHER_USERNAME = 'professor.statsmockexam.teste';
const TEST_TEACHER2_USERNAME = 'professor2.statsmockexam.teste';
const TEST_ADMIN_USERNAME = 'admin.statsmockexam.teste';

const ALL_TEST_USERNAMES = [
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
  TEST_TEACHER_USERNAME,
  TEST_TEACHER2_USERNAME,
  TEST_ADMIN_USERNAME,
];

function makeSut() {
  return makeGetAuthorMockExamStats();
}
