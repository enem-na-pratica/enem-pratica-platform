import { HttpClient } from '@/src/web/api/shared';
import type { InstructorWithStudentCountDto, UserDto } from './user.dto';
import { UserMapper } from './user.mapper';
import type { InstructorWithStudentCount, User } from './user.model';

type UserServiceDeps = {
  httpClient: HttpClient,
}

type CreateUserDto = {
  name: string;
  username: string;
  password: string;
  role: string;
  teacherId?: string | undefined;
}

export class UserService {
  private readonly httpClient: HttpClient;

  constructor(deps: UserServiceDeps) {
    this.httpClient = deps.httpClient;
  }

  async create(dataUser: CreateUserDto): Promise<User> {
    const data = await this.httpClient.post<UserDto>({
      endpoint: "/users",
      options: { data: dataUser }
    });

    return UserMapper.toModel(data);
  }

  async list(): Promise<User[]> {
    const data = await this.httpClient.get<UserDto[]>({
      endpoint: "/users"
    });

    return data.map((u) => UserMapper.toModel(u));
  }

  async getAuthenticated(): Promise<User> {
    const data = await this.httpClient.get<UserDto>({
      endpoint: "/users/me"
    });

    return UserMapper.toModel(data);
  }

  async listAvailableInstructors(): Promise<InstructorWithStudentCount[]> {
    const data = await this.httpClient.get<InstructorWithStudentCountDto[]>({
      endpoint: "/users/instructors"
    });

    return data.map((i) => UserMapper.toInstructorModel(i));
  }
}