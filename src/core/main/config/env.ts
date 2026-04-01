import { z } from 'zod';

// ─── Constants (avoid magic numbers) ──────────────────────────────────────────
// const DEFAULT_POSTGRES_PORT = 5432;
const MIN_JWT_SECRET_LENGTH = 32;

// ─── Server-only Schema ───────────────────────────────────────────────────────
const serverSchema = z.object({
  // POSTGRES_DB: z.string().min(1),
  // POSTGRES_USER: z.string().min(1),
  // POSTGRES_PASSWORD: z.string().min(1),
  // POSTGRES_HOST: z.string().min(1),
  // POSTGRES_PORT: z.coerce
  //   .number()
  //   .int()
  //   .positive()
  //   .default(DEFAULT_POSTGRES_PORT),
  DATABASE_URL: z.url(),
  DIRECT_URL: z.url(),
  JWT_SECRET: z.string().min(MIN_JWT_SECRET_LENGTH, {
    error: `JWT_SECRET must be at least ${MIN_JWT_SECRET_LENGTH} characters long`,
  }),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
});

// ─── Client Schema (NEXT_PUBLIC_ + NODE_ENV only) ────────────────────────────
const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
});

// ─── Conditional validation based on environment ─────────────────────────────
const isServer = typeof window === 'undefined';

const serverEnv = isServer
  ? serverSchema.parse(process.env)
  : serverSchema.partial().parse({}); // Never accessed on the client

const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

// ─── Exported Object ─────────────────────────────────────────────────────────
export const env = {
  // Database (server-only)
  // get POSTGRES_DB() {
  //   assertServer('POSTGRES_DB');
  //   return serverEnv.POSTGRES_DB!;
  // },
  // get POSTGRES_USER() {
  //   assertServer('POSTGRES_USER');
  //   return serverEnv.POSTGRES_USER!;
  // },
  // get POSTGRES_PASSWORD() {
  //   assertServer('POSTGRES_PASSWORD');
  //   return serverEnv.POSTGRES_PASSWORD!;
  // },
  // get POSTGRES_HOST() {
  //   assertServer('POSTGRES_HOST');
  //   return serverEnv.POSTGRES_HOST!;
  // },
  // get POSTGRES_PORT() {
  //   assertServer('POSTGRES_PORT');
  //   return serverEnv.POSTGRES_PORT!;
  // },
  get DATABASE_URL() {
    assertServer('DATABASE_URL');
    return serverEnv.DATABASE_URL!;
  },
  get DIRECT_URL() {
    assertServer('DIRECT_URL');
    return serverEnv.DIRECT_URL!;
  },
  get JWT_SECRET() {
    assertServer('JWT_SECRET');
    return serverEnv.JWT_SECRET!;
  },

  // Available on both sides
  NEXT_PUBLIC_API_URL: clientEnv.NEXT_PUBLIC_API_URL,
  NODE_ENV: clientEnv.NODE_ENV,

  // Helpers
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

// ─── Guard ────────────────────────────────────────────────────────────────────
function assertServer(key: string): void {
  if (typeof window !== 'undefined') {
    throw new Error(
      `[env] "${key}" is a server-only variable and cannot be accessed on the client.`,
    );
  }
}
