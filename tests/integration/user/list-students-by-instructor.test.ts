import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';

const TEST_PASSWORD = 'Senha@123';

const TEST_TEACHER_USERNAME = 'teacher.liststudents.teste';
const TEST_TEACHER2_USERNAME = 'teacher2.liststudents.teste';
const TEST_ADMIN_USERNAME = 'admin.liststudents.teste';
const TEST_STUDENT_USERNAME = 'student.liststudents.teste';
const TEST_STUDENT2_USERNAME = 'student2.liststudents.teste';

const ALL_TEST_USERNAMES = [
  TEST_TEACHER_USERNAME,
  TEST_TEACHER2_USERNAME,
  TEST_ADMIN_USERNAME,
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
];

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
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

describe('ListStudentsByInstructorController (integration)', () => {});
