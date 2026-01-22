import type { UseCase } from '@/src/core/application/common/interfaces';
import type { LoginDto } from './login.dto';
import type { UserRepository } from '@/src/core/domain/contracts/repositories';
import type { HashComparer } from '@/src/core/domain/contracts/crypto';
import type { TokenGenerator } from '@/src/core/domain/contracts/auth';
import {
  UserNotFoundError,
  IncorrectPasswordError
} from '@/src/core/domain/errors';

type LoginUseCaseDeps = {
  userRepository: UserRepository;
  hashComparer: HashComparer;
  tokenGenerator: TokenGenerator;
}

export class LoginUseCase implements UseCase<LoginDto, string> {
  private readonly userRepository: UserRepository;
  private readonly hashComparer: HashComparer;
  private readonly tokenGenerator: TokenGenerator;

  constructor({
    userRepository,
    hashComparer,
    tokenGenerator
  }: LoginUseCaseDeps) {
    this.userRepository = userRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
  }

  async execute({ username, password }: LoginDto): Promise<string> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new UserNotFoundError({
        fieldName: 'username',
        entityValue: username
      });
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      user.passwordHash
    );
    if (!passwordMatch) throw new IncorrectPasswordError();

    const accessToken = this.tokenGenerator.generate({
      id: user.id!,
      role: user.role,
      username: user.username,
    });

    return accessToken;
  }
}