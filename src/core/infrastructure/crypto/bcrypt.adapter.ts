import { compare, hash } from 'bcrypt';

import type { HashComparer, Hasher } from '@/src/core/domain/contracts/crypto';

const MIN_SALT = 10;

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number = MIN_SALT) {
    if (salt < MIN_SALT) {
      throw new Error(
        `BcryptAdapter: Salt cost must be at least ${MIN_SALT}. Received: ${salt}`,
      );
    }
  }

  async hash(value: string): Promise<string> {
    return await hash(value, this.salt);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await compare(value, hash);
  }
}
