import { NotFoundError } from './not-found.error';

type UserNotFoundErrorParams = {
  fieldName?: string;
  entityValue?: string | number;
  message?: string;
};

export class UserNotFoundError extends NotFoundError {
  constructor(params: UserNotFoundErrorParams = {}) {
    super({ entityName: 'User', ...params });
  }
}
