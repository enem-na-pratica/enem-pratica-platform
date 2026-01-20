import { UserRepository } from "@/src/core/domain/user/user.repository.interface";
import { CreateUser } from "@/src/core/application/interfaces/user";
import { CreateUserDto, UserResDto } from "@/src/core/application/dtos/user";
import { ToDtoMapper } from "@/src/core/domain/mapper";
import { User } from "@/src/core/domain/entities/user.entity";
import { StudentRegistrationCommand } from "@/src/core/application/commands/interfaces";
import { Role, ROLES } from "@/src/core/domain/auth";
import { Hasher } from "@/src/core/domain/secure";
import { UserAlreadyExistsError } from "@/src/core/domain/errors/resource/";

export type CreateUserUseCaseDep = {
  userRepository: UserRepository;
  userCommand: StudentRegistrationCommand;
  mapper: ToDtoMapper<User, UserResDto>;
  hasher: Hasher;
}

export class CreateUserUseCase implements CreateUser {
  private readonly userRepository: UserRepository;
  private readonly userCommand: StudentRegistrationCommand;
  private readonly mapper: ToDtoMapper<User, UserResDto>;
  private readonly hasher: Hasher;

  constructor(deps: CreateUserUseCaseDep) {
    this.userRepository = deps.userRepository;
    this.userCommand = deps.userCommand;
    this.mapper = deps.mapper;
    this.hasher = deps.hasher;
  }

  async execute(user: CreateUserDto): Promise<UserResDto> {
    const { name, password, username, teacherId } = user;
    const role = user.role as Role;

    const userExists = !!(await this.userRepository.findByUsername(username));

    if (userExists) {
      throw new UserAlreadyExistsError({
        fieldName: 'username',
        entityValue: username,
      });
    }

    if (role === ROLES.STUDENT && teacherId) {
      await this.userRepository.getById(teacherId);

      const passwordHash = await this.hasher.hash(password);

      const newStudent = User.create({ name, passwordHash, role, username });

      const newStudentRes = await this.userCommand.registerStudent({
        student: newStudent,
        teacherId
      });

      return this.mapper.toDto(newStudentRes);
    }

    const passwordHash = await this.hasher.hash(password);

    const newUser = User.create({ name, passwordHash, role, username });

    const newUserRes = await this.userRepository.create(newUser);

    return this.mapper.toDto(newUserRes);
  }
}