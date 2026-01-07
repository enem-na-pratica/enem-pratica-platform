import { User } from "@/src/core/domain/user/user.entity";

export interface UserRepository {
  findAll(): Promise<User[]>;
  findByUsername(username: string): Promise<User | null>;
}
