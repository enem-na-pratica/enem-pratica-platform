import { BaseError } from "./base.error";

export class ForbiddenError extends BaseError {
  constructor(
    message: string = 'Access denied. You do not have the necessary permissions for this resource.'
  ) {
    super(message);
  }
}
