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
