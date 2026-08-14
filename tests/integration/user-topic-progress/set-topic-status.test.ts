import { randomUUID } from 'crypto';

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { ROLES, type Role } from '@/src/core/domain/auth';
import { TOPIC_STATUS } from '@/src/core/domain/entities';
import type { Requester } from '@/src/core/domain/services';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makeSetTopicStatus } from '@/src/core/main/factories/user-topic-progress/make-set-topic-status.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const TEST_PASSWORD = 'Senha@123';
let cachedPasswordHash: string;

const TEST_STUDENT_USERNAME = 'student.settopicstatus.teste';
const TEST_STUDENT2_USERNAME = 'student2.settopicstatus.teste';
const TEST_TEACHER_USERNAME = 'teacher.settopicstatus.teste';
const TEST_TEACHER2_USERNAME = 'teacher2.settopicstatus.teste';
const TEST_ADMIN_USERNAME = 'admin.settopicstatus.teste';

const ALL_TEST_USERNAMES = [
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
  TEST_TEACHER_USERNAME,
  TEST_TEACHER2_USERNAME,
  TEST_ADMIN_USERNAME,
];

const TEST_SUBJECT_SLUG = 'subject-set-topic-status-teste';

let testTopicId: string;
let testTopic2Id: string;

type RequestBody = Partial<{ topicId: string; status: string }>;
