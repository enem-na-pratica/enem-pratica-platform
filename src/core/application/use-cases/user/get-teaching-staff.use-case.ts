import { TeachingStaffQuery } from "@/src/core/application/queries/interfaces";
import { TeachingStaffOptionResDto, UserResDto } from "@/src/core/application/dtos/user";
import { ToDtoMapper } from "@/src/core/domain/mapper";
import { User } from "@/src/core/domain/user/user.entity";
import { GetTeachingStaff } from "@/src/core/application/interfaces/user/get-teaching-staff-use-case.interface";

export type GetTeachingStaffUseCaseDep = {
  userService: TeachingStaffQuery;
  mapper: ToDtoMapper<User, UserResDto>
}

export class GetTeachingStaffUseCase implements GetTeachingStaff {
  private readonly userService: TeachingStaffQuery;
  private readonly mapper: ToDtoMapper<User, UserResDto>;

  constructor(deps: GetTeachingStaffUseCaseDep) {
    this.userService = deps.userService;
    this.mapper = deps.mapper;
  }

  async execute(): Promise<TeachingStaffOptionResDto[]> {
    const teachingStaff = await this.userService.findTeachingStaff();
    const teachingStaffDtos: TeachingStaffOptionResDto[] = teachingStaff.map(
      (staff) => {
        return {
          user: this.mapper.toDto(staff.user),
          studentsCount: staff.studentsCount,
        }
      });

    return teachingStaffDtos;
  }
}
