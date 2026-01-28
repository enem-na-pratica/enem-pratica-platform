type ApiErrorDeps = {
  status: number;
  message: string;
  data?: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly data?: unknown;

  constructor({ status, message, data }: ApiErrorDeps) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}
