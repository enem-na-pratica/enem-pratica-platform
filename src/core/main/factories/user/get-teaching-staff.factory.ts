import { UserResDtoMapper } from "@/src/core/application/mapper/user-dto.mapper";
import { makePrismaUserQuery } from "@/src/core/main/factories/queries";
import { GetTeachingStaffUseCase } from "@/src/core/application/use-cases/user/get-teaching-staff.use-case";
import { GetTeachingStaffController } from "@/src/core/presentation/controllers/user/get-teaching-staff.controller";

export function makeGetTeachingStaffController() {
  const userService = makePrismaUserQuery();
  const mapper = new UserResDtoMapper();
  const getTeachingStaffUseCase = new GetTeachingStaffUseCase({
    mapper,
    userService,
  });
  return new GetTeachingStaffController({
    getTeachingStaffUseCase
  });
}