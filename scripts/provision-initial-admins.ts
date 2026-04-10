import { ROLES } from '@/src/core/domain/auth';

type FieldErrors = Record<string, string[]>;

type SeedUserTemplate = {
  name: string;
  username: string;
  password: string;
  role: string;
};

type UserCreationResult = {
  success: boolean;
  username: string;
  userId?: string;
  statusCode?: number;
  errorMessage?: string;
};

type SeedSummary = {
  totalAttempted: number;
  totalSucceeded: number;
  totalFailed: number;
  failedUsers: Array<{ username: string; reason: string }>;
  executionTimeMs: number;
};

const SEED_EXECUTION_CONTEXT = {
  id: 'user-id-executor',
  username: 'super_admin',
  role: ROLES.SUPER_ADMIN,
};

const INITIAL_USERS: SeedUserTemplate[] = [
  {
    name: 'Carlos Mendes',
    username: 'carlos.mendes',
    password: 'Temp#User1234!',
    role: ROLES.ADMIN,
  },
];

const HTTP_STATUS = {
  SUCCESS_RANGE_START: 200,
  SUCCESS_RANGE_END: 299,
  CONFLICT: 409,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};
