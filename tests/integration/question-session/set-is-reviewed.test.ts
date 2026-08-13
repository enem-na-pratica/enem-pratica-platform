import { randomUUID } from 'node:crypto';

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { QuestionSessionDto } from '@/src/core/application/common/dtos';
import { ROLES, type Role } from '@/src/core/domain/auth';
import type { Requester } from '@/src/core/domain/services';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makeSetIsReviewed } from '@/src/core/main/factories/question-session/make-set-is-reviewed.factory';
import type { AuthenticatedRequest } from '@/src/core/presentation/protocols';

describe('SetIsReviewedController (integration)', () => {});
