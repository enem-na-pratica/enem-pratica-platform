import { TeachingStaffOptionDTO } from "@/src/core/application/dtos/user";

export interface GetTeachingStaff {
  execute(): Promise<TeachingStaffOptionDTO[]>;
}