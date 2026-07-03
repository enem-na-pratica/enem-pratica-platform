import { execSync } from 'child_process';
import path from 'path';

import dotenv from 'dotenv';
import { beforeAll } from 'vitest';

dotenv.config({ path: path.resolve(__dirname, '../.env.test'), quiet: true });

beforeAll(() => {
  execSync('npx prisma migrate deploy', {
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL!,
    },
    stdio: 'pipe',
  });
});
