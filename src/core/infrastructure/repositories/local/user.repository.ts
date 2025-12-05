import { UserRepository } from "@/src/core/domain/user/user.repository.interface";
import { User } from "@/src/core/domain/user/user.entity";
import { ROLES } from "@/src/core/domain/auth/roles";

const MOCK_DB: User[] = [
  User.create({
    name: "Carlos Andrade",
    username: "carlos.andrade",
    passwordHash: "hash_aleatorio_123456789",
    role: ROLES.TEACHER,
  }),
];

export class UserRepositoryLocal implements UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const user = MOCK_DB.find((u) => u.username === username);
    return user || null;
  }
}
