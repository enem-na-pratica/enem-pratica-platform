import { UserServiceHttp } from '@/src/services/user/user.service.interface';
import { HttpClient } from '@/src/services/common/http/http-client.interface';
import { Mapper } from "@/src/services/common/interfaces/mapper.interface"
import { UserResponseDto } from '@/src/services/dtos';
import { UserModel } from "@/src/services/models"

type UserServiceDeps = {
  httpClient: HttpClient,
  mapper: Mapper<UserResponseDto, UserModel>
}

export class UserService implements UserServiceHttp {
  private readonly httpClient: HttpClient;
  private readonly mapper: Mapper<UserResponseDto, UserModel>;

  constructor(deps: UserServiceDeps) {
    this.httpClient = deps.httpClient;
    this.mapper = deps.mapper;
  }

  async getMe(): Promise<UserModel> {
    const data = await this.httpClient.get<UserResponseDto>("/users/me");

    return this.mapper.toModel(data);
  }
}
