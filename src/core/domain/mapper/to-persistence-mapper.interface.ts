export interface ToPersistenceMapper<I, O> {
  toPersistence(input: I): O;
}