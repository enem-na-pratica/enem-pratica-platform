import { BaseError } from "./base.error";

export class TokenExpiredError extends BaseError {
  constructor(
    message: string = 'The authentication token has expired. Please login again.'
  ) {
    super(message);
  }
}