/**
 * Represents primitive values that should not be recursively transformed.
 */
type Primitive = string | number | boolean | bigint | symbol | null | undefined;

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

/**
 * Recursively flattens and resolves complex types into a clean, fully expanded object shape.
 *
 * Similar to `Prettify`, but applied deeply to all nested properties.
 * This is useful when working with complex generics, intersections,
 * mapped types, Prisma results, DTO compositions, or deeply nested objects,
 * where TypeScript tooltips become hard to read.
 *
 * `DeepPrettify` preserves primitive values, Date, Map, Set, and Array types,
 * while recursively resolving object properties into a simplified structure.
 *
 * @example
 * type Complex = {
 *   user: { id: string } & { name: string };
 *   tags: Array<{ a: number } & { b: number }>;
 * };
 *
 * type Readable = DeepPrettify<Complex>;
 *
 * // Hovering Readable shows:
 * // {
 * //   user: { id: string; name: string };
 * //   tags: { a: number; b: number }[];
 * // }
 *
 * @remarks
 * **⚠️ Performance Warning:**
 * `DeepPrettify` is computationally expensive. It traverses the entire type tree recursively.
 * Avoid using it on:
 * - Deeply nested types (>5 levels)
 * - Types with many unions or conditional branches
 * - Recursive type definitions
 * - Overly generic compositions (especially from ORMs or complex library types)
 *
 * This can cause:
 * - TypeScript compiler slowdown
 * - IDE lag and slow hover tooltips
 * - Higher memory usage
 *
 * For lighter alternatives, consider:
 * - `Prettify<T>` for a single-level flatten
 * - Applying it selectively only to specific properties
 * - Breaking complex types into smaller, intermediate types
 *
 * This utility only affects TypeScript type visualization.
 * It does not change runtime behavior.
 *
 * Particularly useful when:
 * - Working with intersection types (`A & B`)
 * - Working with Prisma / ORM result types
 * - Building DTOs from multiple sources
 * - Creating utility types with generics
 * - Improving IDE tooltip readability
 */
type DeepPrettify<T> = T extends Primitive
  ? T
  : T extends Date
    ? T
    : T extends Map<infer K, infer V>
      ? Map<DeepPrettify<K>, DeepPrettify<V>>
      : T extends Set<infer U>
        ? Set<DeepPrettify<U>>
        : T extends Array<infer U>
          ? DeepPrettify<U>[]
          : T extends object
            ? { [K in keyof T]: DeepPrettify<T[K]> } & {}
            : T;
