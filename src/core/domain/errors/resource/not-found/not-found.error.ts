import { BaseError, type ErrorCategory } from '@/src/core/domain/errors';

const DEFAULT_NOT_FOUND_MESSAGE = 'Entity not found.';

type NotFoundErrorParams = {
  entityName?: string;
  fieldName?: string;
  entityValue?: string | number;
  message?: string;
};

export class NotFoundError extends BaseError {
  public category: ErrorCategory = 'NOT_FOUND';

  constructor({
    entityName,
    fieldName,
    entityValue,
    message,
  }: NotFoundErrorParams = {}) {
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
