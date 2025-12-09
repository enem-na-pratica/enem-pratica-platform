import { UserRepository } from "@/src/core/domain/user/user.repository.interface";
import { Login } from "@/src/core/application/interfaces/auth/login-use-case.interface";
import { UserDTO } from "@/src/core/application/dtos/user";
import {
  LoginInputDTO,
  LoginOutputDTO,
} from "@/src/core/application/dtos/auth";
import { UserNotFoundError, IncorrectPasswordError } from "@/src/core/domain/errors";
import { HashComparer } from "@/src/core/domain/secure";

export type LoginUseCaseDep = {
  userRepository: UserRepository;
  hashComparer: HashComparer;
}

export class LoginUseCase implements Login {
  private readonly userRepository: UserRepository;
  private readonly hashComparer: HashComparer;

  constructor(deps: LoginUseCaseDep) {
    this.userRepository = deps.userRepository;
    this.hashComparer = deps.hashComparer;
  }

  async execute(credentials: LoginInputDTO): Promise<LoginOutputDTO> {
    const user = await this.userRepository.findByUsername(credentials.username);

    if (!user) throw new UserNotFoundError('username', credentials.username);

    const passwordMatch = await this.hashComparer.compare(
      credentials.password,
      user.passwordHash
    );
    if (!passwordMatch) throw new IncorrectPasswordError()

    // TODO: Implementar geração de token JWT
    const fakeJwtToken = `fake_token_${user.id}_${Date.now()}`;

    // TODO: Implementar UserDTO mapping
    const userDTO: UserDTO = {
      id: user.id!,
      name: user.name,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return {
      accessToken: fakeJwtToken,
      user: userDTO
    };
  }
}