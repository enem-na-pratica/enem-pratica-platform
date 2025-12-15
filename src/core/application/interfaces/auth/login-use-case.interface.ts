import { LoginInputDTO } from "@/src/core/application/dtos/auth";

export interface Login {
  execute(credentials: LoginInputDTO): Promise<string>;
}
