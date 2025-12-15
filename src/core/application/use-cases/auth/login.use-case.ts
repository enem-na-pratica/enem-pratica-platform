import { UserRepository } from "@/src/core/domain/user/user.repository.interface";
import { Login } from "@/src/core/application/interfaces/auth/login-use-case.interface";
import { LoginInputDTO } from "@/src/core/application/dtos/auth";
import { UserNotFoundError, IncorrectPasswordError } from "@/src/core/domain/errors";
import { HashComparer } from "@/src/core/domain/secure";
import { TokenGenerator } from "@/src/core/domain/auth";
import { TokenPayload } from "@/src/core/domain/shared/interfaces"

export type LoginUseCaseDep = {
  userRepository: UserRepository;
  hashComparer: HashComparer;
  tokenGenerator: TokenGenerator<TokenPayload>;
}

export class LoginUseCase implements Login {
  private readonly userRepository: UserRepository;
  private readonly hashComparer: HashComparer;
  private readonly tokenGenerator: TokenGenerator<TokenPayload>;

  constructor(deps: LoginUseCaseDep) {
    this.userRepository = deps.userRepository;
    this.hashComparer = deps.hashComparer;
    this.tokenGenerator = deps.tokenGenerator;
  }

  async execute(credentials: LoginInputDTO): Promise<string> {
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

    return accessToken;
  }
}