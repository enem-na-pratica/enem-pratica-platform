import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { UserDto } from '@/src/core/application/common/dtos';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makeListStudentsByInstructor } from '@/src/core/main/factories/user/make-list-students-by-instructor.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

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

type TestRequester = { id: string; username: string; role: Role };

function makeSut() {
  return makeListStudentsByInstructor();
}

function makeRequest(
  username: string,
  requester: TestRequester,
): AuthenticatedRequest<void> {
  return {
    body: undefined,
    params: { username },
    requester,
  } as AuthenticatedRequest<void>;
}

async function createUser(data: {
  name: string;
  username: string;
  role: Role;
}): Promise<{ id: string; username: string; role: Role }> {
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
  return { id: user.id, username: user.username, role: user.role as Role };
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

describe('ListStudentsByInstructorController (integration)', () => {
  describe('GET /api/users/instructors/:username/students — success cases', () => {
    it('should return 200 with an empty array when the instructor (accessed via "me") has no students', async () => {
      const teacher = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });

      const controller = makeSut();
      const response = await controller.handle(makeRequest('me', teacher));

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return 200 and the linked students when the instructor accesses their own list via "me"', async () => {
      const teacher = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      const student1 = await createUser({
        name: 'Aluno Um',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const student2 = await createUser({
        name: 'Aluno Dois',
        username: TEST_STUDENT2_USERNAME,
        role: ROLES.STUDENT,
      });
      await linkStudentToTeacher(student1.id, teacher.id);
      await linkStudentToTeacher(student2.id, teacher.id);

      const controller = makeSut();
      const response = await controller.handle(makeRequest('me', teacher));

      expect(response.statusCode).toBe(200);
      const body = response.body as UserDto[];
      expect(body).toHaveLength(2);

      const usernames = body.map((s) => s.username);
      expect(usernames).toContain(TEST_STUDENT_USERNAME);
      expect(usernames).toContain(TEST_STUDENT2_USERNAME);
    });

    it('should return the correct shape for each student entry and never expose the password hash', async () => {
      const teacher = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      const student = await createUser({
        name: 'Aluno Um',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await linkStudentToTeacher(student.id, teacher.id);

      const controller = makeSut();
      const response = await controller.handle(makeRequest('me', teacher));

      expect(response.statusCode).toBe(200);
      const body = response.body as UserDto[];
      const found = body.find((s) => s.username === TEST_STUDENT_USERNAME);

      expect(found).toBeDefined();
      expect(found).toHaveProperty('id');
      expect(found).toHaveProperty('name');
      expect(found).toHaveProperty('username');
      expect(found).toHaveProperty('role');
      expect(found).toHaveProperty('createdAt');
      expect(found).toHaveProperty('updatedAt');
      expect(found).not.toHaveProperty('password');
      expect(found).not.toHaveProperty('passwordHash');
      expect(found?.role).toBe(ROLES.STUDENT);
    });

    it('should only return students linked to the requested instructor, not to other instructors', async () => {
      const teacher1 = await createUser({
        name: 'Professor Um',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      const teacher2 = await createUser({
        name: 'Professor Dois',
        username: TEST_TEACHER2_USERNAME,
        role: ROLES.TEACHER,
      });
      const student1 = await createUser({
        name: 'Aluno Um',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      const student2 = await createUser({
        name: 'Aluno Dois',
        username: TEST_STUDENT2_USERNAME,
        role: ROLES.STUDENT,
      });
      await linkStudentToTeacher(student1.id, teacher1.id);
      await linkStudentToTeacher(student2.id, teacher2.id);

      const controller = makeSut();
      const response = await controller.handle(makeRequest('me', teacher1));

      expect(response.statusCode).toBe(200);
      const body = response.body as UserDto[];
      expect(body).toHaveLength(1);
      expect(body[0].username).toBe(TEST_STUDENT_USERNAME);
    });

    it('should allow an ADMIN to list a TEACHER students by explicit username', async () => {
      const admin = await createUser({
        name: 'Admin Teste',
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });
      const teacher = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });
      const student = await createUser({
        name: 'Aluno Um',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });
      await linkStudentToTeacher(student.id, teacher.id);

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest(TEST_TEACHER_USERNAME, admin),
      );

      expect(response.statusCode).toBe(200);
      const body = response.body as UserDto[];
      expect(body).toHaveLength(1);
      expect(body[0].username).toBe(TEST_STUDENT_USERNAME);
    });
  });

  describe('GET /api/users/instructors/:username/students — error cases', () => {
    it('should return 400 when the username param fails validation', async () => {
      const teacher = await createUser({
        name: 'Professor Teste',
        username: TEST_TEACHER_USERNAME,
        role: ROLES.TEACHER,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest('-invalido', teacher),
      );

      expect(response.statusCode).toBe(400);
    });

    it('should return 404 when the target instructor username does not exist', async () => {
      const admin = await createUser({
        name: 'Admin Teste',
        username: TEST_ADMIN_USERNAME,
        role: ROLES.ADMIN,
      });

      const controller = makeSut();
      const response = await controller.handle(
        makeRequest('nao.existe.instrutor', admin),
      );

      expect(response.statusCode).toBe(404);
    });

    it('should return 403 when a STUDENT tries to access the instructor students route', async () => {
      const student = await createUser({
        name: 'Aluno Teste',
        username: TEST_STUDENT_USERNAME,
        role: ROLES.STUDENT,
      });

      const controller = makeSut();
      const response = await controller.handle(makeRequest('me', student));

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({
        message:
          'You do not have permission to perform actions for users with an equivalent or higher role.',
      });
    });
  });
});
