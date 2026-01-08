import { BaseError } from "./base.error";

export class UnauthorizedError extends BaseError {
  constructor(
    message: string = 'You are not authorized to perform this action.'
  ) {
    super(message);
  }
}
