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
  });
});
