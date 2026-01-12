import { EntityAlreadyExistsError } from "./entity-already-exists.error";

type UserAlreadyExistsParams = {
  fieldName?: string;
  entityValue?: string | number;
  message?: string;
};

export class UserAlreadyExistsError extends EntityAlreadyExistsError {
  constructor(params: UserAlreadyExistsParams = {}) {
    super({ entityName: 'User', ...params });
  }
}