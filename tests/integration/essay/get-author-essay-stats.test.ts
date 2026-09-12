import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { EssayStatsDto } from '@/src/core/application/use-cases/essay';
import { ROLES, type Role } from '@/src/core/domain/auth';
import type { Requester } from '@/src/core/domain/services';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeGetAuthorEssaysStats } from '@/src/core/main/factories/essay/make-get-author-essay-stats.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const DUMMY_PASSWORD_HASH = 'hash-nao-utilizado-neste-fluxo';

const SUFFIX = 'essaystats.teste';

const USERNAMES = {
  student: `student.${SUFFIX}`,
  student2: `student-2.${SUFFIX}`,
  teacher: `teacher.${SUFFIX}`,
  teacher2: `teacher-2.${SUFFIX}`,
  admin: `admin.${SUFFIX}`,
};

const ALL_TEST_USERNAMES = Object.values(USERNAMES);

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  await prisma.essay.deleteMany({
    where: { author: { username: { in: ALL_TEST_USERNAMES } } },
  });
  await prisma.studentTeacher.deleteMany({
    where: {
      OR: [
        { student: { username: { in: ALL_TEST_USERNAMES } } },
        { teacher: { username: { in: ALL_TEST_USERNAMES } } },
      ],
    },
  });
  await prisma.user.deleteMany({
    where: { username: { in: ALL_TEST_USERNAMES } },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GetAuthorEssaysStatsController (integration)', () => {});
