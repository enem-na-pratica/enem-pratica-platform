import { env } from '@/src/core/main/config';
import { LogoutController } from '@/src/core/presentation/controllers/auth';

export function makeLogout() {
  return new LogoutController({ isProduction: env.isProduction });
}
