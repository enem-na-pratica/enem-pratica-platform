import { Role } from "@/src/core/domain/auth/roles";
import { UserResponse } from "@/src/ui/application/services/infrastructure/types";
import { UserModel } from "@/src/ui/application/models";
import { ToModelMapper } from "@/src/ui/application/interfaces/mappers";

export class UserMapper implements ToModelMapper<UserResponse, UserModel> {
  toModel(response: UserResponse): UserModel {
    return {
      id: response.id,
      name: response.name,
      username: response.username,
      role: response.role as Role,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    };
  }
}
