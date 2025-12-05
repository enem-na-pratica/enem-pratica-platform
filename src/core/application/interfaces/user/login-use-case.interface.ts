import { LoginInputDTO, LoginOutputDTO } from "@/src/core/application/dtos/user";

export interface Login {
  execute(credentials: LoginInputDTO): Promise<LoginOutputDTO>;
}
