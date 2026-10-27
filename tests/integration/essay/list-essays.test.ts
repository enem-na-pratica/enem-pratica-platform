import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { EssayPaginatedResponse } from '@/src/core/application/use-cases/essay/list-essays';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makeListEssays } from '@/src/core/main/factories/essay/make-list-essays.factory';
import type {
  AuthenticatedRequest,
  ErrorResponse,
} from '@/src/core/presentation/protocols';

const TEST_PASSWORD = 'Senha@123';
let cachedPasswordHash: string;

const TEST_STUDENT_USERNAME = 'student.essays.teste';
const TEST_STUDENT2_USERNAME = 'student2.essays.teste';
const TEST_TEACHER_USERNAME = 'teacher.essays.teste';
const TEST_ADMIN_USERNAME = 'admin.essays.teste';

const ALL_TEST_USERNAMES = [
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
  TEST_TEACHER_USERNAME,
  TEST_ADMIN_USERNAME,
];

type TestRequester = { id: string; username: string; role: Role };

type ValidationErrorBody = ErrorResponse<Record<string, string[]>>;
