import { User } from "@/src/core/domain/user/user.entity";

export interface UserRepository {
  create(user: User): Promise<User>;
  getById(userId: string): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
