import { ToDtoMapper } from "@/src/core/domain/mapper"
import { User } from "@/src/core/domain/user/user.entity";
import { UserResDto } from "@/src/core/application/dtos/user";

export class UserResDtoMapper implements ToDtoMapper<User, UserResDto> {
  toDto(user: User): UserResDto {
    if (!user.id) {
      throw new Error("Cannot map an user without a valid ID to DTO.");
    }

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } as UserResDto
  }
}