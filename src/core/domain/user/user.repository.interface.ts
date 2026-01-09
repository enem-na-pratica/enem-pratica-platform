import { User } from "@/src/core/domain/user/user.entity";

export interface UserRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findByUsername(username: string): Promise<User | null>;
}
