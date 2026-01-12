import { BaseError } from "@/src/core/domain/errors";

export class IncorrectPasswordError extends BaseError {
  constructor() {
    super("Incorrect password");
  }
}
