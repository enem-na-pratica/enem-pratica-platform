import { JwtAdapter } from '@/src/core/infrastructure/auth';
import { env } from '@/src/core/main/config';

export function makeJwtAdapter() {
  return new JwtAdapter({ secret: env.JWT_SECRET, expiresIn: '7D' });
}
