/**
 * Contract for validating unknown input at system boundaries,
 * such as HTTP request bodies.
 *
 * @example
 * const validator: Validator<User> = ...;
 * const user = validator.validate(req.body); // user is typed as User
 */
export interface Validator<TOutput> {
  /**
   * @throws {ValidationError} If the input does not conform to the expected shape.
   */
  validate(input: unknown): TOutput;
}
