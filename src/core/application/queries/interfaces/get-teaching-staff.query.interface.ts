import { TeachingStaffReadModel } from "@/src/core/application/queries/read-model";

// TODO: Switch to find
export interface GetTeachingStaffService {
  getTeachingStaff(): Promise<TeachingStaffReadModel[]>;
}
