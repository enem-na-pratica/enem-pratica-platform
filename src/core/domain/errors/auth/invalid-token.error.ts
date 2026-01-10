import { BaseError } from "@/src/core/domain/errors";

export class InvalidTokenError extends BaseError {
  constructor(message: string = 'The authentication token is invalid.') {
    super(message);
  }
}