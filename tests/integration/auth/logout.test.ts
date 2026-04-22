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

    it('should set httpOnly flag to true', async () => {
      const { controller } = makeSut();

      const response = await controller.handle();

      const authCookie = response.cookies?.find((c) => c.name === 'auth_token');
      expect(authCookie?.options.httpOnly).toBe(true);
    });

    it('should set sameSite to strict', async () => {
      const { controller } = makeSut();

      const response = await controller.handle();

      const authCookie = response.cookies?.find((c) => c.name === 'auth_token');
      expect(authCookie?.options.sameSite).toBe('strict');
    });

    it('should set path to root /', async () => {
      const { controller } = makeSut();

      const response = await controller.handle();

      const authCookie = response.cookies?.find((c) => c.name === 'auth_token');
      expect(authCookie?.options.path).toBe('/');
    });

    it('should set secure flag to false in development', async () => {
      const { controller } = makeSut(false);

      const response = await controller.handle();

      const authCookie = response.cookies?.find((c) => c.name === 'auth_token');
      expect(authCookie?.options.secure).toBe(false);
    });

    it('should set secure flag to true in production', async () => {
      const { controller } = makeSut(true);

      const response = await controller.handle();

      const authCookie = response.cookies?.find((c) => c.name === 'auth_token');
      expect(authCookie?.options.secure).toBe(true);
    });
  });
});
