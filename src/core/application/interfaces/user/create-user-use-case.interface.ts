import {
  CreateUserDto,
  UserResDto
} from "@/src/core/application/dtos/user";

export interface CreateUser {
  execute(user: CreateUserDto): Promise<UserResDto>;
}