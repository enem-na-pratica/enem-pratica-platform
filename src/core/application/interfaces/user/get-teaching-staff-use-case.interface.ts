import { TeachingStaffOptionResDto } from "@/src/core/application/dtos/user";

export interface GetTeachingStaff {
  execute(): Promise<TeachingStaffOptionResDto[]>;
}