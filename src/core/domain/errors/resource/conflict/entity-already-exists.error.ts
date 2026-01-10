import { ConflictError } from "./conflict.error";

const DEFAULT_ALREADY_EXISTS_MESSAGE = 'Entity already exists.';

type EntityAlreadyExistsParams = {
  entityName?: string;
  fieldName?: string;
  entityValue?: string | number;
  message?: string;
};

export class EntityAlreadyExistsError extends ConflictError {
  constructor({
    entityName,
    fieldName,
    entityValue,
    message,
  }: EntityAlreadyExistsParams = {}) {
    let msg: string;

    if (message) {
      msg = message;
    } else if (entityName && fieldName && entityValue) {
      msg = `${entityName} with ${fieldName} '${entityValue}' already exists.`;
    } else if (entityName) {
      msg = `${entityName} already exists.`;
    } else {
      msg = DEFAULT_ALREADY_EXISTS_MESSAGE;
    }

    super(msg);
  }
}