import { Role } from "@/src/core/domain/auth/roles";
import { UserResponseDto } from "@/src/services/dtos/";
import { UserModel } from "@/src/services/models";
import { Mapper } from "@/src/services/common/interfaces";

export class UserMapper implements Mapper<UserResponseDto, UserModel> {
  toModel(response: UserResponseDto): UserModel {
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
