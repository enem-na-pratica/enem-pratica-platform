import { User } from "@/src/core/domain/entities/user.entity";

export type TeachingStaffReadModel = {
  user: User;
  studentsCount: number;
}
