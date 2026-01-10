import { BaseError } from "@/src/core/domain/errors";

export class ForbiddenError extends BaseError {
  constructor(
    message: string = 'Access denied. You do not have the necessary permissions for this resource.'
  ) {
    super(message);
  }
}
