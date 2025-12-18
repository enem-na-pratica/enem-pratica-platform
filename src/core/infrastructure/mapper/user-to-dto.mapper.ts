import { User } from "@/src/core/domain/user/user.entity";
import { UserDTO } from "@/src/core/application/dtos/user";
import { ToDtoMapper } from "@/src/core/domain/mapper";

export class UserToDTOMapper implements ToDtoMapper<User, UserDTO> {
  toDto(input: User): UserDTO {
    return {
      id: input.id!,
      name: input.name,
      username: input.username,
      role: input.role,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    };
  }
}