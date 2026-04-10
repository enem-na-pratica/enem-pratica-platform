import { UserDto } from '@/src/core/application/common/dtos';
import { ROLES } from '@/src/core/domain/auth';
import { ErrorResponse } from '@/src/core/presentation/protocols';

type FieldErrors = Record<string, string[]>;

type SeedUserTemplate = {
  name: string;
  username: string;
  password: string;
  role: string;
};

type UserCreationResult = {
  success: boolean;
  username: string;
  userId?: string;
  statusCode?: number;
  errorMessage?: string;
};

type SeedSummary = {
  totalAttempted: number;
  totalSucceeded: number;
  totalFailed: number;
  failedUsers: Array<{ username: string; reason: string }>;
  executionTimeMs: number;
};

const SEED_EXECUTION_CONTEXT = {
  id: 'user-id-executor',
  username: 'super_admin',
  role: ROLES.SUPER_ADMIN,
};

const INITIAL_USERS: SeedUserTemplate[] = [
  {
    name: 'Carlos Mendes',
    username: 'carlos.mendes',
    password: 'Temp#User1234!',
    role: ROLES.ADMIN,
  },
];

const HTTP_STATUS = {
  SUCCESS_RANGE_START: 200,
  SUCCESS_RANGE_END: 299,
  CONFLICT: 409,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

class SeedLogger {
  private readonly timestamp = (): string => {
    const now = new Date().toISOString();
    return `[${now}]`;
  };

  logSeedStarted(totalUsers: number): void {
    console.log('\n');
    console.log('═'.repeat(80));
    console.log(
      `${this.timestamp()} 🚀 Iniciando process de seed do banco de dados`,
    );
    console.log(
      `${this.timestamp()} 📋 Total de usuários base a criar: ${totalUsers}`,
    );
    console.log(
      `${this.timestamp()} 👤 Executor: ${SEED_EXECUTION_CONTEXT.username}`,
    );
    console.log('═'.repeat(80));
    console.log('');
  }

  logSeedAborted(): void {
    console.log('\n');
    console.log('═'.repeat(80));
    console.log(
      `${this.timestamp()} ⚠️  Seed abortado: O banco de dados já possui usuários`,
    );
    console.log(
      `${this.timestamp()} 💡 Dica: Use a flag --force para ignorar esta validação`,
    );
    console.log('═'.repeat(80));
    console.log('');
  }

  logUserCreationStarted(
    userName: string,
    userRole: string,
    index: number,
    total: number,
  ): void {
    const progressBar = this.buildProgressBar(index, total);
    console.log(
      `${this.timestamp()} ${progressBar} Processando: "${userName}" (${userRole})`,
    );
  }

  logUserCreationSuccess(username: string, userId: string): void {
    console.log(
      `${this.timestamp()} ✅ Sucesso: "${username}" persistido no banco | ID: ${userId}`,
    );
  }

  logUserAlreadyExists(username: string): void {
    console.log(
      `${this.timestamp()} ℹ️  Info: Usuário "${username}" já existe no banco`,
    );
  }

  logValidationError(username: string, fieldErrors: FieldErrors): void {
    console.log(
      `${this.timestamp()} ⚠️  Validação: "${username}" contém dados inválidos:`,
    );

    Object.entries(fieldErrors).forEach(([field, errors]) => {
      errors.forEach((error) => {
        console.log(`${this.timestamp()}    └─ ${field}: ${error}`);
      });
    });
  }

  logCreationFailed(username: string, statusCode: number): void {
    const statusDescription = this.getStatusDescription(statusCode);
    console.log(
      `${this.timestamp()} ❌ Falha: "${username}" não foi criado (HTTP ${statusCode} - ${statusDescription})`,
    );
  }

  logUnexpectedError(username: string, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(
      `${this.timestamp()} 🔴 Erro inesperado ao criar "${username}": ${errorMessage}`,
    );
  }

  logSeedCompleted(summary: SeedSummary): void {
    console.log('');
    console.log('═'.repeat(80));
    console.log(`${this.timestamp()} ✨ Seed finalizado`);
    console.log(
      `${this.timestamp()} 📊 Resultado: ${summary.totalSucceeded}/${summary.totalAttempted} usuários criados`,
    );

    if (summary.totalFailed > 0) {
      console.log(
        `${this.timestamp()} ⚠️  ${summary.totalFailed} usuário(s) falharam:`,
      );
      summary.failedUsers.forEach((failed) => {
        console.log(
          `${this.timestamp()}    • "${failed.username}": ${failed.reason}`,
        );
      });
    }

    console.log(
      `${this.timestamp()} ⏱️  Tempo total: ${summary.executionTimeMs}ms`,
    );
    console.log('═'.repeat(80));
    console.log('');
  }

  private buildProgressBar(current: number, total: number): string {
    const progressNumber = current + 1;
    const filled = Math.round((progressNumber / total) * 10);
    const empty = 10 - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `[${bar}] (${progressNumber}/${total})`;
  }

  private getStatusDescription(statusCode: number): string {
    const descriptions: Record<number, string> = {
      [HTTP_STATUS.BAD_REQUEST]: 'Dados inválidos',
      [HTTP_STATUS.UNAUTHORIZED]: 'Não autorizado',
      [HTTP_STATUS.FORBIDDEN]: 'Acesso proibido',
      [HTTP_STATUS.CONFLICT]: 'Usuário já existe',
      [HTTP_STATUS.NOT_FOUND]: 'Recurso não encontrado',
      [HTTP_STATUS.INTERNAL_ERROR]: 'Erro interno do servidor',
    };

    return descriptions[statusCode] || 'Erro desconhecido';
  }
}

class CreationResponseParser {
  parse(
    username: string,
    response: { statusCode: number; body?: UserDto | ErrorResponse },
  ): UserCreationResult {
    const { statusCode, body } = response;
    const isSuccessful = this.isSuccessfulStatus(statusCode);

    if (isSuccessful) {
      const userId = (body as UserDto)?.id ?? 'unknown';
      return {
        success: true,
        username,
        userId,
        statusCode,
      };
    }

    const errorResponse = body as ErrorResponse;
    const errorMessage = errorResponse?.message ?? 'Erro desconhecido';

    const errorDetails = (
      errorResponse as ErrorResponse & { details?: FieldErrors }
    )?.details;
    const fullErrorMessage = errorDetails
      ? JSON.stringify(errorDetails)
      : errorMessage;

    return {
      success: false,
      username,
      statusCode,
      errorMessage: fullErrorMessage,
    };
  }

  private isSuccessfulStatus(statusCode: number): boolean {
    return (
      statusCode >= HTTP_STATUS.SUCCESS_RANGE_START &&
      statusCode <= HTTP_STATUS.SUCCESS_RANGE_END
    );
  }
}
