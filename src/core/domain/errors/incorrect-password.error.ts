import { BaseError } from "./base.error";

export class IncorrectPasswordError extends BaseError {
  constructor() {
    super("Incorrect password");
  }
}
