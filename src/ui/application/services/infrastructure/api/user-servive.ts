import { UserModel } from "@/src/ui/application/models";
import { UserResponse } from "@/src/ui/application/services/infrastructure/types";
import { ToModelMapper } from "@/src/ui/application/interfaces/mappers";

type UserServiceDeps = {
  mapper: ToModelMapper<UserResponse, UserModel>;
  baseUrl?: string;
}

export class UserService {
  private readonly baseUrl: string;
  private readonly mapper: ToModelMapper<UserResponse, UserModel>;

  constructor(
    deps: UserServiceDeps
  ) {
    this.baseUrl = deps.baseUrl || "http://localhost:3000/api";
    this.mapper = deps.mapper;
  }

  async getMe(token: string): Promise<UserModel | null> {
    const response = await fetch(`${this.baseUrl}/users/me`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Cookie: `auth_token=${token}`,
      },
    });

    if (response.status === 500) {
      throw new Error("SERVER_ERROR"); // TODO: Create a custom error
    }

    if (!response.ok) return null;

    const data = await response.json();
    return this.mapper.toModel(data);
  }
}