import { UserRepository } from "@/src/core/domain/user/user.repository.interface";
import { User } from "@/src/core/domain/user/user.entity";
import { ROLES } from "@/src/core/domain/auth/roles";

const MOCK_DB: User[] = [
  User.create({
    name: "Carlos Andrade",
    username: "carlos.andrade",
    passwordHash: "$2b$12$8QHdhZ8bP4tLH.ZjaOKNpuCQUt5plrgKfbCUKEGX1Gc2hDmSGewkC",
    // 0123456789
    role: ROLES.TEACHER,
  }),
];

export class UserRepositoryLocal implements UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const user = MOCK_DB.find((u) => u.username === username);
    return user || null;
  }
}
