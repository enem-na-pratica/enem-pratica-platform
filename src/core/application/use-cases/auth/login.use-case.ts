import { UserRepository } from "@/src/core/domain/user/user.repository.interface";
import { Login } from "@/src/core/application/interfaces/auth/login-use-case.interface";
import { UserDTO } from "@/src/core/application/dtos/user";
import {
  LoginInputDTO,
  LoginOutputDTO,
} from "@/src/core/application/dtos/auth";
import { UserNotFoundError, IncorrectPasswordError } from "@/src/core/domain/errors";
import { HashComparer } from "@/src/core/domain/secure";
import { TokenGenerator } from "@/src/core/domain/auth";
import { ToDtoMapper } from "@/src/core/domain/mapper"
import { User } from "@/src/core/domain/user/user.entity";

export type AuthPayload = {
  id: string;
  username: string;
  role: string;
};


export type LoginUseCaseDep = {
  userRepository: UserRepository;
  hashComparer: HashComparer;
  tokenGenerator: TokenGenerator<AuthPayload>;
  mapper: ToDtoMapper<User, UserDTO>
}

export class LoginUseCase implements Login {
  private readonly userRepository: UserRepository;
  private readonly hashComparer: HashComparer;
  private readonly tokenGenerator: TokenGenerator<AuthPayload>;
  private readonly mapper: ToDtoMapper<User, UserDTO>;

  constructor(deps: LoginUseCaseDep) {
    this.userRepository = deps.userRepository;
    this.hashComparer = deps.hashComparer;
    this.tokenGenerator = deps.tokenGenerator;
    this.mapper = deps.mapper;
  }

  async execute(credentials: LoginInputDTO): Promise<LoginOutputDTO> {
    const user = await this.userRepository.findByUsername(credentials.username);

    if (!user) throw new UserNotFoundError('username', credentials.username);

    const passwordMatch = await this.hashComparer.compare(
      credentials.password,
      user.passwordHash
    );
    if (!passwordMatch) throw new IncorrectPasswordError()

    const accessToken = this.tokenGenerator.generate({
      id: user.id!,
      role: user.role,
      username: user.username,
    });

    const userDTO = this.mapper.toDto(user);

    return {
      accessToken,
      user: userDTO
    };
  }
}