import { TeachingStaffReadModel } from "@/src/core/application/queries/read-model";

export interface TeachingStaffQuery {
  findTeachingStaff(): Promise<TeachingStaffReadModel[]>;
}
