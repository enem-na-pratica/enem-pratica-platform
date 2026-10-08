import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { QuestionSessionStatsDto } from '@/src/core/application/use-cases/question-session';
import { ROLES, type Role } from '@/src/core/domain/auth';
import type { Requester } from '@/src/core/domain/services';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makeGetQuestionSessionStatsByAuthor } from '@/src/core/main/factories/question-session/make-get-question-session-stats-by-author.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const DAY_MS = 24 * 60 * 60 * 1000;
const TEST_PASSWORD = 'Senha@123';
let cachedPasswordHash: string;

const TEST_SUBJECT_SLUG = 'qs-stats-integration-subject';
let topicId: string;

const USERNAMES = {
  student: 'student.qsstats.teste',
  student2: 'student2.qsstats.teste',
  teacher: 'teacher.qsstats.teste',
  admin: 'admin.qsstats.teste',
} as const;

const ALL_TEST_USERNAMES = Object.values(USERNAMES);
