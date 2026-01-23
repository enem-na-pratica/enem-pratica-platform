import type { HashComparer, Hasher } from '@/src/core/domain/contracts/crypto';
import { hash, compare } from 'bcrypt';

export class BcryptAdapter implements Hasher, HashComparer {
  private static readonly MIN_SALT = 10;

  constructor(private readonly salt: number = BcryptAdapter.MIN_SALT) {
    if (salt < BcryptAdapter.MIN_SALT) {
      throw new Error(`BcryptAdapter: Salt cost must be at least ${BcryptAdapter.MIN_SALT}. Received: ${salt}`);
    }
  }

  async hash(value: string): Promise<string> {
    return await hash(value, this.salt);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await compare(value, hash);
  }
}
