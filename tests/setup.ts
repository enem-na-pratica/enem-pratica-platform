import { execSync } from 'child_process';

import 'dotenv/config';
import { beforeAll } from 'vitest';

beforeAll(() => {
  execSync('npx prisma migrate deploy', {
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL!,
    },
    stdio: 'inherit',
  });
});
