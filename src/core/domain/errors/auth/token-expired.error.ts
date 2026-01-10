import { BaseError } from "@/src/core/domain/errors";

export class TokenExpiredError extends BaseError {
  constructor(
    message: string = 'The authentication token has expired. Please login again.'
  ) {
    super(message);
  }
}