import { UserRepository } from "@/src/core/domain/user/user.repository.interface";
import { GetCurrentUser } from "@/src/core/application/interfaces/user/get-current-user-use-case.interface";
import { UserDTO } from "@/src/core/application/dtos/user";
import { UserNotFoundError } from "@/src/core/domain/errors";
import { ToDtoMapper } from "@/src/core/domain/mapper";
import { User } from "@/src/core/domain/user/user.entity";

export type GetCurrentUserUseCaseDep = {
  userRepository: UserRepository;
  mapper: ToDtoMapper<User, UserDTO>
}

export class GetCurrentUserUseCase implements GetCurrentUser {
  private readonly userRepository: UserRepository;
  private readonly mapper: ToDtoMapper<User, UserDTO>;

  constructor(deps: GetCurrentUserUseCaseDep) {
    this.userRepository = deps.userRepository;
    this.mapper = deps.mapper;
  }

  async execute(username: string): Promise<UserDTO> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) throw new UserNotFoundError('username', username);

    return this.mapper.toDto(user);
  }
}