import { GetTeachingStaffService } from "@/src/core/application/queries/interfaces/get-teaching-staff.query.interface";
import { TeachingStaffOptionDTO, UserDTO } from "@/src/core/application/dtos/user";
import { ToDtoMapper } from "@/src/core/domain/mapper";
import { User } from "@/src/core/domain/user/user.entity";
import { GetTeachingStaff } from "@/src/core/application/interfaces/user/get-teaching-staff-use-case.interface";

export type GetTeachingStaffUseCaseDep = {
  userService: GetTeachingStaffService;
  mapper: ToDtoMapper<User, UserDTO>
}

export class GetTeachingStaffUseCase implements GetTeachingStaff {
  private readonly userService: GetTeachingStaffService;
  private readonly mapper: ToDtoMapper<User, UserDTO>;

  constructor(deps: GetTeachingStaffUseCaseDep) {
    this.userService = deps.userService;
    this.mapper = deps.mapper;
  }

  async execute(): Promise<TeachingStaffOptionDTO[]> {
    const teachingStaff = await this.userService.getTeachingStaff();
    const teachingStaffDtos: TeachingStaffOptionDTO[] = teachingStaff.map(
      (staff) => {
        return {
          user: this.mapper.toDto(staff.user),
          studentsCount: staff.studentsCount,
        }
      });

    return teachingStaffDtos;
  }
}
