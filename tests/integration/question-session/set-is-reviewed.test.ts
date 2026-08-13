import { randomUUID } from 'node:crypto';

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { QuestionSessionDto } from '@/src/core/application/common/dtos';
import { ROLES, type Role } from '@/src/core/domain/auth';
import type { Requester } from '@/src/core/domain/services';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makeSetIsReviewed } from '@/src/core/main/factories/question-session/make-set-is-reviewed.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const TEST_PASSWORD = 'Senha@123';
let cachedPasswordHash: string;

const PREFIX = 'sir';

const STUDENT_USERNAME = `${PREFIX}.student.teste`;
const STUDENT2_USERNAME = `${PREFIX}.student2.teste`;
const TEACHER_USERNAME = `${PREFIX}.teacher.teste`;
const TEACHER2_USERNAME = `${PREFIX}.teacher2.teste`;
const ADMIN_USERNAME = `${PREFIX}.admin.teste`;

const ALL_TEST_USERNAMES = [
  STUDENT_USERNAME,
  STUDENT2_USERNAME,
  TEACHER_USERNAME,
  TEACHER2_USERNAME,
  ADMIN_USERNAME,
];

const SUBJECT_SLUG = `${PREFIX}-subject-teste`;

let topicId: string;
let subjectId: string;

beforeAll(async () => {
  await prisma.$connect();

  const bcrypt = makeBcryptAdapter();
  cachedPasswordHash = await bcrypt.hash(TEST_PASSWORD);

  const subject = await prisma.subject.create({
    data: {
      name: 'Matemática SIR Teste',
      slug: SUBJECT_SLUG,
      topics: {
        create: { title: 'Tópico SIR Teste', position: 1 },
      },
    },
    include: { topics: true },
  });

  subjectId = subject.id;
  topicId = subject.topics[0].id;
});

afterEach(async () => {
  await prisma.user.deleteMany({
    where: { username: { in: ALL_TEST_USERNAMES } },
  });
});

afterAll(async () => {
  await prisma.subject.delete({ where: { id: subjectId } });
  await prisma.$disconnect();
});

describe('SetIsReviewedController (integration)', () => {});
