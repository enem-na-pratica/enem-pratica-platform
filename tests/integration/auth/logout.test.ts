import { describe, expect, it } from 'vitest';

import { LogoutController } from '@/src/core/presentation/controllers/auth';
import { HttpStatus } from '@/src/core/presentation/helpers';

function makeSut(isProduction: boolean = false) {
  const controller = new LogoutController({ isProduction });
  return { controller };
}

describe('LogoutController (integration)', () => {
  describe('POST /api/auth/logout — success cases', () => {
    it('should return 204 with no content on logout', async () => {
      const { controller } = makeSut();

      const response = await controller.handle();

      expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(response.body).toBeUndefined();
    });

    it('should clear the auth_token cookie with maxAge: 0', async () => {
      const { controller } = makeSut();

      const response = await controller.handle();

      const authCookie = response.cookies?.find((c) => c.name === 'auth_token');
      expect(authCookie).toBeDefined();
      expect(authCookie?.value).toBe('');
      expect(authCookie?.options.maxAge).toBe(0);
    });
  });
});
