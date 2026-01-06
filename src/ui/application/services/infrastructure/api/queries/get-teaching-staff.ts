import { UserModel } from "@/src/ui/application/models";
import { UserResponse } from "@/src/ui/application/services/infrastructure/types";
import { ToModelMapper } from "@/src/ui/application/interfaces/mappers";
import { TeachingStaffResponse } from "@/src/ui/application/services/infrastructure/types"
import { TeachingStaffModel } from "@/src/ui/application/models"

type GetTeachingStaffDeps = {
  mapper: ToModelMapper<UserResponse, UserModel>;
  baseUrl?: string;
}

export class GetTeachingStaff {
  private readonly baseUrl: string;
  private readonly mapper: ToModelMapper<UserResponse, UserModel>;

  constructor(
    deps: GetTeachingStaffDeps
  ) {
    this.baseUrl = deps.baseUrl || "http://localhost:3000/api";
    this.mapper = deps.mapper;
  }

  async execute(token: string): Promise<TeachingStaffModel[]> {
    const response = await fetch(`${this.baseUrl}/teaching-staff`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Cookie: `auth_token=${token}`,
      },
    });

    if (response.status === 500) {
      throw new Error("SERVER_ERROR"); // TODO: Create a custom error
    }

    const data: TeachingStaffResponse[] = await response.json();

    return data.map((staff) => {
      return {
        user: this.mapper.toModel(staff.user),
        studentsCount: staff.studentsCount,
      }
    });
  }
}