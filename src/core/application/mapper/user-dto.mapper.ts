import { UserDto } from '@/src/core/application/common/dtos';
import { Mapper } from '@/src/core/domain/contracts/mappers/mapper.interface';
import { User } from '@/src/core/domain/entities/user.entity';

export class UserDtoMapper implements Mapper<User, UserDto> {
  public map(user: User): UserDto {
    return {
      id: user.id!,
      name: user.name,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
