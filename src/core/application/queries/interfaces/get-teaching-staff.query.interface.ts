import { TeachingStaffReadModel } from "@/src/core/application/queries/read-model";

export interface GetTeachingStaffService {
  getTeachingStaff(): Promise<TeachingStaffReadModel[]>;
}
