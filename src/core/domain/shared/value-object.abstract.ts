export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this.validate(value);
    this._value = Object.freeze(value);
  }

  protected abstract validate(value: T): void;

  public get value(): T { return this._value; }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (this.constructor.name !== vo.constructor.name) {
      return false;
    }
    if (vo._value === undefined) {
      return false;
    }
    return this._value === vo._value;
  }
}