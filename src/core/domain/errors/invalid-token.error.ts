import { BaseError } from "./base.error";

export class InvalidTokenError extends BaseError {
  constructor(message: string = 'The authentication token is invalid.') {
    super(message);
  }
}