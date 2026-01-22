import type { UseCase } from '@/src/core/application/common/interfaces';
import type { UserRepository } from '@/src/core/domain/contracts/repositories';
import type { Mapper } from "@/src/core/domain/contracts/mappers";
import type { UserDto } from "@/src/core/application/common/dtos";
import type { User } from "@/src/core/domain/entities";

type GetAuthenticatedUserUseCaseDeps = {
  userRepository: UserRepository;
  mapper: Mapper<User, UserDto>;
}

export class GetAuthenticatedUserUseCase implements UseCase<string, UserDto> {
  private readonly userRepository: UserRepository;
  private readonly mapper: Mapper<User, UserDto>;

  constructor({
    userRepository,
    mapper
  }: GetAuthenticatedUserUseCaseDeps) {
    this.userRepository = userRepository;
    this.mapper = mapper;
  }

  async execute(userId: string): Promise<UserDto> {
    const user = await this.userRepository.getById(userId);

    return this.mapper.map(user);
  }
}
