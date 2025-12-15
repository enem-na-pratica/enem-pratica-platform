export interface ToDomainMapper<I, O> {
  toDomain(input: I): O;
}