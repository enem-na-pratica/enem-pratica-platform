import {
  CreateUserDto,
  UserResDto
} from "@/src/core/application/dtos/user";

export interface CreateUserUser {
  execute(user: CreateUserDto): Promise<UserResDto>;
}