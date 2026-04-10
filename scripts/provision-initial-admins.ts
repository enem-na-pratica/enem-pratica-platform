import { UserDto } from '@/src/core/application/common/dtos';
import { ROLES } from '@/src/core/domain/auth';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makeCreateUser } from '@/src/core/main/factories/user';
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

class DatabaseSeeder {
  private readonly createUserController = makeCreateUser();
  private readonly logger = new SeedLogger();
  private readonly responseParser = new CreationResponseParser();
  private readonly executionContext = SEED_EXECUTION_CONTEXT;

  async seed(): Promise<void> {
    const startTime = Date.now();
    const isForceMode = process.argv.includes('--force');

    if (!isForceMode) {
      const isDbEmpty = await this.checkIfDatabaseIsEmpty();
      if (!isDbEmpty) {
        this.logger.logSeedAborted();
        return;
      }
    }

    const userTemplates = INITIAL_USERS;

    this.logger.logSeedStarted(userTemplates.length);

    const results = await this.createAllUsers(userTemplates);

    const executionTimeMs = Date.now() - startTime;
    this.printSummary(results, executionTimeMs);
  }

  private async createAllUsers(
    userTemplates: SeedUserTemplate[],
  ): Promise<UserCreationResult[]> {
    const results: UserCreationResult[] = [];

    for (let index = 0; index < userTemplates.length; index++) {
      const userTemplate = userTemplates[index];

      this.logger.logUserCreationStarted(
        userTemplate.name,
        userTemplate.role,
        index,
        userTemplates.length,
      );

      const result = await this.attemptUserCreation(userTemplate);
      results.push(result);

      this.reportCreationResult(result);

      if (index < userTemplates.length - 1) {
        await this.delay(500);
      }
    }

    return results;
  }

  private printSummary(
    results: UserCreationResult[],
    executionTimeMs: number,
  ): void {
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;
    const failedUsers = results
      .filter((r) => !r.success)
      .map((r) => ({
        username: r.username,
        reason: r.errorMessage ?? `HTTP ${r.statusCode}`,
      }));

    const summary: SeedSummary = {
      totalAttempted: results.length,
      totalSucceeded: successCount,
      totalFailed: failureCount,
      failedUsers,
      executionTimeMs,
    };

    this.logger.logSeedCompleted(summary);
  }

  private async checkIfDatabaseIsEmpty(): Promise<boolean> {
    try {
      const existingUser = await prisma.user.findFirst({
        select: { id: true },
      });

      return existingUser === null;
    } catch (error) {
      this.logger.logUnexpectedError('CHECK_DB', error);
      return false;
    } finally {
      await prisma.$disconnect();
    }
  }

  private async attemptUserCreation(
    userTemplate: SeedUserTemplate,
  ): Promise<UserCreationResult> {
    try {
      const response = await this.createUserController.handle({
        body: userTemplate,
        requester: this.executionContext,
      });

      return this.responseParser.parse(userTemplate.username, response);
    } catch (error) {
      this.logger.logUnexpectedError(userTemplate.username, error);

      return {
        success: false,
        username: userTemplate.username,
        errorMessage:
          error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  private reportCreationResult(result: UserCreationResult): void {
    if (result.success && result.userId) {
      this.logger.logUserCreationSuccess(result.username, result.userId);
      return;
    }

    if (result.statusCode === HTTP_STATUS.CONFLICT) {
      this.logger.logUserAlreadyExists(result.username);
      return;
    }

    if (result.statusCode === HTTP_STATUS.BAD_REQUEST) {
      const fieldErrors = this.extractFieldErrors(result.errorMessage);
      this.logger.logValidationError(result.username, fieldErrors);
      return;
    }

    this.logger.logCreationFailed(result.username, result.statusCode ?? 0);
  }

  private extractFieldErrors(errorMessage: string | undefined): FieldErrors {
    if (!errorMessage) {
      return {};
    }

    try {
      const parsed = JSON.parse(errorMessage);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as FieldErrors;
      }
    } catch {
      // Se não for JSON válido, continua
    }

    return {};
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
