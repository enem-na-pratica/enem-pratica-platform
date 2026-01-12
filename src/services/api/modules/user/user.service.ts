import { UserServiceHttp } from '@/src/services/api/modules/user/user.service.interface';
import { HttpClient } from '@/src/services/api/common/http/http-client.interface';
import { Mapper } from "@/src/services/api/common/interfaces/mapper.interface";
import { UserResponseDto, TeachingStaffDto } from '@/src/services/api/dtos';
import { TeachingStaffModel, UserModel } from "@/src/services/api/models"

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

  async create(dataUser: unknown): Promise<UserModel> {
    const data = await this.httpClient.post<UserResponseDto>(
      "/users/new",
      { data: dataUser }
    );

    return this.mapper.toModel(data);
  }

  async findAll(): Promise<UserModel[]> {
    const data = await this.httpClient.get<UserResponseDto[]>("/users");

    return data.map((user) => this.mapper.toModel(user));
  }

  async findTeachingStaff(): Promise<TeachingStaffModel[]> {
    const data = await this.httpClient.get<TeachingStaffDto[]>("/teaching-staff");

    return data.map((staff) => {
      return {
        user: this.mapper.toModel(staff.user),
        studentsCount: staff.studentsCount,
      }
    });
  }
}
