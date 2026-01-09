import { ToDtoMapper } from "@/src/core/domain/mapper"
import { User } from "@/src/core/domain/user/user.entity";
import { UserResDto } from "@/src/core/application/dtos/user";

export class UserResDtoMapper implements ToDtoMapper<User, UserResDto> {
  toDto(input: User): UserResDto {
    return {
      id: input.id!,
      name: input.name,
      username: input.username,
      role: input.role,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt
    } as UserResDto
  }
}