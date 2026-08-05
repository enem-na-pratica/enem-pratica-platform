import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { MockExamDto } from '@/src/core/application/common/dtos';
import type { CreateMockExamDto } from '@/src/core/application/use-cases/mock-exam';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeCreateMockExam } from '@/src/core/main/factories/mock-exam/make-create-mock-exam.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

describe('CreateMockExamController (integration)', () => {
  describe('POST /api/mock-exams/users/:username — success cases', () => {});

  describe('POST /api/mock-exams/users/:username — error cases', () => {});
});
