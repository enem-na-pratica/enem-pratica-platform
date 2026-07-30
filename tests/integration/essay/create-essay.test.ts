import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makeCreateEssay } from '@/src/core/main/factories/essay/make-create-essay.factory';
import type {
  AuthenticatedRequest,
  ErrorResponse,
} from '@/src/core/presentation/protocols';

const TEST_PASSWORD = 'Senha@123';

const TEST_STUDENT_USERNAME = 'student.essay.teste';
const TEST_STUDENT2_USERNAME = 'student2.essay.teste';
const TEST_TEACHER_USERNAME = 'teacher.essay.teste';
const TEST_ADMIN_USERNAME = 'admin.essay.teste';

const ALL_TEST_USERNAMES = [
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
  TEST_TEACHER_USERNAME,
  TEST_ADMIN_USERNAME,
];

const VALID_GRADES = {
  c1: 120,
  c2: 160,
  c3: 200,
  c4: 80,
  c5: 40,
} as const;

const VALID_GRADES_TOTAL = Object.values(VALID_GRADES).reduce(
  (acc, val) => acc + val,
  0,
);
