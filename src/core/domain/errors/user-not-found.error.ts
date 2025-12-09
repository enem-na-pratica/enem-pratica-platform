import { NotFoundError } from '@/src/core/domain/errors/not-found.error';

export class UserNotFoundError extends NotFoundError {
  constructor(
    fieldName?: string,
    entityValue?: string | number,
    message?: string
  ) {
    super('User', fieldName, entityValue, message);
  }
}