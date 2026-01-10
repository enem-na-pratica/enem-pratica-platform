import { BaseError } from "@/src/core/domain/errors";

export class ConflictError extends BaseError {
  constructor(message: string = 'A conflict occurred with the current state of the resource.') {
    super(message);
  }
}
