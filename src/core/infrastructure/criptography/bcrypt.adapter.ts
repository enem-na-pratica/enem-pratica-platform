import { Hasher, HashComparer } from '@/src/core/domain/secure';
import { hash, compare } from 'bcrypt';

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) { }

  async hash(value: string): Promise<string> {
    return await hash(value, this.salt);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await compare(value, hash);
  }
}
