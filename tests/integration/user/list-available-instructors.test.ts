import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { InstructorWithStudentCountDto } from '@/src/core/application/use-cases/user';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeListAvailableInstructors } from '@/src/core/main/factories/user/make-list-available-instructors.factory';

const TEST_PASSWORD = 'Senha@123';

const TEST_TEACHER_USERNAME = 'teacher.instructors.teste';
const TEST_TEACHER2_USERNAME = 'teacher2.instructors.teste';
const TEST_ADMIN_USERNAME = 'admin.instructors.teste';
const TEST_STUDENT_USERNAME = 'student.instructors.teste';

const ALL_TEST_USERNAMES = [
  TEST_TEACHER_USERNAME,
  TEST_TEACHER2_USERNAME,
  TEST_ADMIN_USERNAME,
  TEST_STUDENT_USERNAME,
];

function makeSut() {
  return makeListAvailableInstructors();
}

async function createUser(data: {
  name: string;
  username: string;
  role: Role;
}): Promise<string> {
  const { makeBcryptAdapter } =
    await import('@/src/core/main/factories/common/crypto');
  const bcrypt = makeBcryptAdapter();
  const passwordHash = await bcrypt.hash(TEST_PASSWORD);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      passwordHash,
      role: data.role,
    },
  });

  return user.id;
}

async function linkStudentToTeacher(
  studentId: string,
  teacherId: string,
): Promise<void> {
  await prisma.studentTeacher.create({
    data: { studentId, teacherId },
  });
}

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

describe('ListAvailableInstructorsController (integration)', () => {
  describe('GET /api/users/instructors — success cases', () => {
    it('should return 200 with an empty array when there are no instructors', async () => {
      const controller = makeSut();
      const response = await controller.handle();

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      const body = response.body as InstructorWithStudentCountDto[];
      const testInstructors = body.filter((i) =>
        ALL_TEST_USERNAMES.includes(i.instructor.username),
      );
      expect(testInstructors).toHaveLength(0);
    });
    it('should return 200 and list a TEACHER with studentsCount 0 when they have no students', async () => {
      await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });

      const controller = makeSut();
      const response = await controller.handle();

      expect(response.statusCode).toBe(200);

      const body = response.body as InstructorWithStudentCountDto[];
      const found = body.find(
        (i) => i.instructor.username === TEST_TEACHER_USERNAME,
      );

      expect(found).toBeDefined();
      expect(found?.studentsCount).toBe(0);
      expect(found?.instructor).toMatchObject({
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
    });

    it('should return 200 and list an ADMIN as an available instructor', async () => {
      await createUser({
        name: 'Admin Teste',
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });

      const controller = makeSut();
      const response = await controller.handle();

      expect(response.statusCode).toBe(200);

      const body = response.body as InstructorWithStudentCountDto[];
      const found = body.find(
        (i) => i.instructor.username === TEST_ADMIN_USERNAME,
      );

      expect(found).toBeDefined();
      expect(found?.instructor.role).toBe(ROLES.ADMIN);
    });

    it('should NOT include STUDENT role in the results', async () => {
      await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle();

      expect(response.statusCode).toBe(200);

      const body = response.body as InstructorWithStudentCountDto[];
      const found = body.find(
        (i) => i.instructor.username === TEST_STUDENT_USERNAME,
      );

      expect(found).toBeUndefined();
    });

    it('should return the correct studentsCount when a teacher has students linked', async () => {
      const teacherId = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      const studentId = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      await linkStudentToTeacher(studentId, teacherId);

      const controller = makeSut();
      const response = await controller.handle();

      expect(response.statusCode).toBe(200);

      const body = response.body as InstructorWithStudentCountDto[];
      const found = body.find(
        (i) => i.instructor.username === TEST_TEACHER_USERNAME,
      );

      expect(found).toBeDefined();
      expect(found?.studentsCount).toBe(1);
    });

    it('should return both TEACHERs and ADMINs but not STUDENTs', async () => {
      await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      await createUser({
        name: 'Admin Teste',
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });
      await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle();

      expect(response.statusCode).toBe(200);

      const body = response.body as InstructorWithStudentCountDto[];
      const testResults = body.filter((i) =>
        ALL_TEST_USERNAMES.includes(i.instructor.username),
      );

      expect(testResults).toHaveLength(2);

      const usernames = testResults.map((i) => i.instructor.username);
      expect(usernames).toContain(TEST_TEACHER_USERNAME);
      expect(usernames).toContain(TEST_ADMIN_USERNAME);
      expect(usernames).not.toContain(TEST_STUDENT_USERNAME);
    });
  });
});
