import { BaseError } from "@/src/core/domain/errors";

const DEFAULT_NOT_FOUND_MESSAGE = 'Entity not found.';

export class NotFoundError extends BaseError {
  constructor(
    entityName?: string,
    fieldName?: string,
    entityValue?: string | number,
    message?: string
  ) {
    let msg: string;

    if (message) {
      msg = message;

    } else if (entityName && fieldName && entityValue) {
      msg = `${entityName} with ${fieldName} '${entityValue}' not found.`;

    } else if (entityName) {
      msg = `${entityName} not found.`;

    } else {
      msg = DEFAULT_NOT_FOUND_MESSAGE;
    }

    super(msg);
  }
}