import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { UserQuestionSessionsOverviewDto } from '@/src/core/application/use-cases/question-session/list-user-question-session-statistics';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeListUserQuestionSessionsStatistics } from '@/src/core/main/factories/question-session/make-list-user-question-sessions-statistics.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const DUMMY_PASSWORD_HASH = 'irrelevant-hash-for-this-suite';

const SUBJECT_NAME = 'QSS Integration Test Subject';
const SUBJECT_SLUG = 'qss-integration-test-subject';
const TOPIC_TITLE = 'QSS Integration Test Topic';

const STUDENT_USERNAME = 'student.qss.teste';
const STUDENT2_USERNAME = 'student2.qss.teste';
const TEACHER_USERNAME = 'teacher.qss.teste';
const ADMIN_USERNAME = 'admin.qss.teste';

const ALL_TEST_USERNAMES = [
  STUDENT_USERNAME,
  STUDENT2_USERNAME,
  TEACHER_USERNAME,
  ADMIN_USERNAME,
];

const DAY_MS = 24 * 60 * 60 * 1000;
