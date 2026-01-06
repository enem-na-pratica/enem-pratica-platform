import { UserDtoMapper } from "@/src/core/application/mapper/user-dto.mapper";
import { makeUserPrismaService } from "@/src/core/main/factories/queries/user-service.factory";
import { GetTeachingStaffUseCase } from "@/src/core/application/use-cases/user/get-teaching-staff.use-case";
import { GetTeachingStaffController } from "@/src/core/presentation/controllers/user/get-teaching-staff.controller";

export function makeGetTeachingStaffController() {
  const userService = makeUserPrismaService();
  const mapper = new UserDtoMapper();
  const getTeachingStaffUseCase = new GetTeachingStaffUseCase({
    mapper,
    userService,
  });
  return new GetTeachingStaffController({
    getTeachingStaffUseCase
  });
}