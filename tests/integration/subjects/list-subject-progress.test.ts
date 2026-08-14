import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { TopicProgressDto } from '@/src/core/application/use-cases/subject/list-subject-progress';
import { ROLES, type Role } from '@/src/core/domain/auth';
import { TOPIC_STATUS } from '@/src/core/domain/entities';
import type { Requester } from '@/src/core/domain/services';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeListSubjectProgress } from '@/src/core/main/factories/subject/make-list-subject-progress.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

const TEST_STUDENT_USERNAME = 'aluno.progresso.teste';
const TEST_STUDENT2_USERNAME = 'aluno-dois.progresso.teste';
const TEST_TEACHER_USERNAME = 'professor.progresso.teste';
const TEST_TEACHER2_USERNAME = 'professor-dois.progresso.teste';
const TEST_ADMIN_USERNAME = 'admin.progresso.teste';

const ALL_TEST_USERNAMES = [
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
  TEST_TEACHER_USERNAME,
  TEST_TEACHER2_USERNAME,
  TEST_ADMIN_USERNAME,
];

const SUBJECT_SLUG = 'matematica-progresso-teste';
const EMPTY_SUBJECT_SLUG = 'fisica-progresso-teste-vazio';

type ListSubjectProgressParam = { subjectSlug: string; username: string };
type ListSubjectProgressQuery = { status: string | string[] };
