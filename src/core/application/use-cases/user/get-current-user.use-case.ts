import { UserRepository } from "@/src/core/domain/user/user.repository.interface";
import { GetCurrentUser } from "@/src/core/application/interfaces/user/get-current-user-use-case.interface";
import { UserResDto } from "@/src/core/application/dtos/user";
import { UserNotFoundError } from "@/src/core/domain/errors";
import { ToDtoMapper } from "@/src/core/domain/mapper";
import { User } from "@/src/core/domain/user/user.entity";

export type GetCurrentUserUseCaseDep = {
  userRepository: UserRepository;
  mapper: ToDtoMapper<User, UserResDto>
}

export class GetCurrentUserUseCase implements GetCurrentUser {
  private readonly userRepository: UserRepository;
  private readonly mapper: ToDtoMapper<User, UserResDto>;

  constructor(deps: GetCurrentUserUseCaseDep) {
    this.userRepository = deps.userRepository;
    this.mapper = deps.mapper;
  }

  async execute(username: string): Promise<UserResDto> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) throw new UserNotFoundError('username', username);

    return this.mapper.toDto(user);
  }
}