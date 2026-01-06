import { GetTeachingStaff } from "@/src/ui/application/services/infrastructure/api/queries/get-teaching-staff";
import { UserMapper } from "@/src/ui/application/services/infrastructure/mappers/user.mapper";

export function makeGetTeachingStaff() {
  return new GetTeachingStaff({
    mapper: new UserMapper()
  });
}