import type { UseCase } from '@/src/core/application/common/interfaces';
import type { CreateUserDto } from './create-user.dto';
import type { UserRepository } from '@/src/core/domain/contracts/repositories';
import type { Hasher } from '@/src/core/domain/contracts/crypto';
import type { Role } from '@/src/core/domain/auth';
import type { Mapper } from "@/src/core/domain/contracts/mappers";
import type { UserDto } from "@/src/core/application/common/dtos";
import { ROLES } from '@/src/core/domain/auth';
import { hasExactRole } from '@/src/core/domain/auth';
import { UserAlreadyExistsError } from "@/src/core/domain/errors";
import { User } from "@/src/core/domain/entities";

type CreateUserUseCaseDeps = {
  userRepository: UserRepository;
  hasher: Hasher;
  mapper: Mapper<User, UserDto>;
}

export class CreateUserUseCase implements UseCase<CreateUserDto, UserDto> {
  private readonly userRepository: UserRepository;
  private readonly hasher: Hasher;
  private readonly mapper: Mapper<User, UserDto>;

  constructor({
    userRepository,
    hasher,
    mapper
  }: CreateUserUseCaseDeps) {
    this.userRepository = userRepository;
    this.hasher = hasher;
    this.mapper = mapper;
  }

  async execute(input: CreateUserDto): Promise<UserDto> {
    const { name, password, username, teacherId } = input;
    const role = input.role as Role;

    const userExists = !!(await this.userRepository.findByUsername(username));

    if (userExists) {
      throw new UserAlreadyExistsError({
        fieldName: 'username',
        entityValue: username,
      });
    }

    let validatedTeacherId: string | undefined = undefined;

    if (hasExactRole(ROLES.STUDENT, role)) {
      if (!teacherId) {
        // TODO: create custom error, "MissingParamError"
        throw new Error('Teacher ID is required for students.');
      }
      await this.userRepository.getById(teacherId);
      validatedTeacherId = teacherId;
    }

    const passwordHash = await this.hasher.hash(password);
    const user = User.create({ name, username, passwordHash, role });

    const newUser = await this.userRepository.create({
      user,
      teacherId: validatedTeacherId,
    });

    return this.mapper.map(newUser);
  }
}
