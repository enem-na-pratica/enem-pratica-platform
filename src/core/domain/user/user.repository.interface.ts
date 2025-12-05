import { User } from "@/src/core/domain/user/user.entity";

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
}