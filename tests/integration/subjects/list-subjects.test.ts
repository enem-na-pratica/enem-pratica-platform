import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { SubjectDto } from '@/src/core/application/common/dtos';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeListSubjects } from '@/src/core/main/factories/subject/make-list-subjects.factory';

const TEST_SUBJECT_NAME = 'Matemática Teste';
const TEST_SUBJECT_SLUG = 'matematica-teste';
const TEST_SUBJECT_CATEGORY = 'Exatas';

const TEST_SUBJECT2_NAME = 'Português Teste';
const TEST_SUBJECT2_SLUG = 'portugues-teste';

const TEST_SUBJECT3_NAME = 'História Teste';
const TEST_SUBJECT3_SLUG = 'historia-teste';

const ALL_TEST_SLUGS = [
  TEST_SUBJECT_SLUG,
  TEST_SUBJECT2_SLUG,
  TEST_SUBJECT3_SLUG,
];

function makeSut() {
  return makeListSubjects();
}

async function createSubject(data: {
  name: string;
  slug: string;
  category?: string | null;
}): Promise<string> {
  const subject = await prisma.subject.create({
    data: {
      name: data.name,
      slug: data.slug,
      category: data.category ?? null,
    },
  });

  return subject.id;
}

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  await prisma.subject.deleteMany({
    where: { slug: { in: ALL_TEST_SLUGS } },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
