import { User } from "@/src/core/domain/user/user.entity";

export type TeachingStaffReadModel = {
  user: User;
  studentsCount: number;
}
