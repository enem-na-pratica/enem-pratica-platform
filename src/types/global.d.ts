/**
 * Constructs a type by making a subset of properties (K) from T optional.
 * * This is particularly useful when you have a model where most fields are required,
 * but certain operations (like updates or partial creations) only require a few.
 * @example
 * interface User { id: string; name: string; age: number; }
 * type UpdateUser = Optional<User, 'name' | 'age'>;
 * // Result: { id: string; name?: string; age?: number; }
 * @remarks
 * This utility is useful when creating update, draft, or partial versions
 * of existing domain models without making all properties optional.
 */
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * A helper type that "flattens" complex intersections into a single object representation.
 * * TypeScript often displays intersected types (e.g., `A & B & C`) as a long string of unions.
 * Wrapping a type in `Prettify` forces the IDE to resolve the properties and display
 * them as a clean, single object in tooltips.
 * @example
 * type Complex = { a: string } & { b: number };
 * type Readable = Prettify<Complex>; 
 * // Hovering 'Readable' shows: { a: string; b: number; }
 * @remarks
 * This utility does not change runtime behavior.
 * It exists purely to improve type readability in IDE tooltips,
 * error messages, and inferred types.
 *
 * Commonly used when working with intersection types, mapped types,
 * or complex generics.
 */
type Prettify<T> = {
  [P in keyof T]: T[P];
} & {};