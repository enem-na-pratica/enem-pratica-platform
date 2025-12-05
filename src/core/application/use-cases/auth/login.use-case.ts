import { UserRepository } from "@/src/core/domain/user/user.repository.interface";
import { Login } from "@/src/core/application/interfaces/auth/login-use-case.interface";
import { UserDTO } from "@/src/core/application/dtos/user";
import {
  LoginInputDTO,
  LoginOutputDTO,
} from "@/src/core/application/dtos/auth";

export class LoginUseCase implements Login {
  constructor(private userRepository: UserRepository) { }

  async execute(credentials: LoginInputDTO): Promise<LoginOutputDTO> {
    const user = await this.userRepository.findByUsername(credentials.username);

    // TODO: Implementar erro personalizado
    if (!user) throw new Error("User not found");

    // TODO: Implementar verificação de senha com hash
    if (user.passwordHash !== credentials.password) {
      throw new Error("Invalid password");
    }

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