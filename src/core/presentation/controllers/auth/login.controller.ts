import { Login } from '@/src/core/application/interfaces/auth/login-use-case.interface';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/src/core/presentation/interfaces';

export class LoginController implements Controller {
  constructor(private loginUseCase: Login) { }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { username, password } = request.body;

      // TODO: Implementar validação mais completa
      if (!username || !password) {
        return {
          statusCode: 400,
          body: { error: "Username e senha são obrigatórios." },
        };
      }

      const result = await this.loginUseCase.execute({ username, password });

      return {
        statusCode: 200,
        body: {
          data: result,
        },
      };
    } catch (err: unknown) {
      const error = err as Error;
      return {
        statusCode: 500,
        body: { error: error.message || "Erro inesperado." },
      };
    }
  }
} 