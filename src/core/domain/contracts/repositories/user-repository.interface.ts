import type { User } from "@/src/core/domain/entities/user.entity";

export interface CreateUserParams {
  user: User;
  teacherId?: string;
}

export interface UserRepository {
  create(input: CreateUserParams): Promise<User>;
  getById(userId: string): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
}
